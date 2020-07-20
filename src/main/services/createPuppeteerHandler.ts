import path from "path"
import { ChildProcess } from "child_process"
import puppeteer, { errors } from "puppeteer"

import * as utils from "../utils"
import { errCodes } from "../errHandler"

import { CallBackType } from "./createCaptureHandler"
import { DeviceInfoType } from "./devices"
import { CaptureTargetInfo } from "./urlListParser"
import { LogicsType } from "./Logics"
import { boolean } from "yargs"

export const EXPECTED_ERROR = {
  timeOut: "timeOut",
  cancel: "cancel",
  statusErr: "statusErr",
  crash: "crash",
} as const

export type OutputType = "pdf" | "img"

export type ExpectedErrorType = typeof EXPECTED_ERROR[keyof typeof EXPECTED_ERROR]

export type LaunchOptionsType = {
  headless?: boolean
}

export type SettingsType = {
  executablePath: string
  captureSavePath: string
  launchOptions?: LaunchOptionsType
}

export type CaptureArgsType = {
  url: string
  fileName: string | number
  captureTargets: { device: DeviceInfoType; output: OutputType[] }[]
  onTitle: (title: string) => any
}

export type CaptureResultType = {
  status: CaptureTargetInfo["status"]
  results:
    | {
        filePaths: string[]
        name: string
      }[]
    | null
  error: ExpectedErrorType | null
}

export type CaptureType = (args: CaptureArgsType) => Promise<CaptureResultType>
type CancelType = () => void
type CloseType = () => Promise<void>

const PUPPETEER_DEFAULT_SETTINGS = {
  headless: utils.isTest ? false : true,
  ignoreHTTPSErrors: true,
}

const PAGE_SETTINGS = {
  waitUntil: "networkidle0",
} as const

const launchPuppeteer = async (
  executablePath: string,
  launchOptions: LaunchOptionsType = {}
): Promise<{
  page: puppeteer.Page
  browser: puppeteer.Browser
}> => {
  const browser = await puppeteer.launch({
    executablePath,
    ...PUPPETEER_DEFAULT_SETTINGS,
    ...launchOptions,
  })
  const page = await browser.newPage()

  return {
    browser,
    page,
  }
}

const createFilePath = (
  captureSavePath: string,
  fileName: string | number,
  name: string,
  outputType: OutputType
) => {
  return path.join(
    captureSavePath,
    `${fileName}-${name}.${outputType === "img" ? "png" : "pdf"}`
  )
}

const isValidStatus = (status: number | null) => {
  return status ? /^2[0-9]{2,2}$/.test(String(status)) : false
}

const detectCancelError = (
  isCanceled: boolean,
  e?: Error & {
    message: string
  }
) => {
  return (
    (e?.message.includes("Protocol error") ||
      e?.message.includes(
        "Navigation failed because browser has disconnected!"
      )) &&
    isCanceled
  )
}

const handleError = (isCanceled: boolean, e?: Error & { message: string }) => {
  // 中断時
  if (detectCancelError(isCanceled, e)) {
    return EXPECTED_ERROR.cancel
  }

  // タイムアウトエラー
  if (e?.message.startsWith("TimeoutError")) {
    return EXPECTED_ERROR.timeOut
  }

  // ページクラッシュ
  if (e?.message === "Page crashed!") {
    return EXPECTED_ERROR.crash
  }

  // 想定外のエラー
  if (utils.isDevelopment || utils.isTest) {
    throw e
  } else {
    throw new Error(errCodes.BROWSER_ERROR)
  }
}

const gotoPage = async (page: puppeteer.Page, url: string) => {
  const response = await page.goto(url, PAGE_SETTINGS)
  const status = response ? response.status() : null
  const validStatus = isValidStatus(status)
  return {
    status,
    validStatus,
  }
}

const capture = async (
  page: puppeteer.Page,
  outputType: OutputType,
  path: string
) => {
  if (outputType === "img") {
    // 画像
    await page.emulateMediaType(null)
    await page.screenshot({
      path,
      fullPage: true,
    })
  } else {
    // pdf
    const dimension = await page.evaluate(() => ({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    }))
    await page.emulateMediaType("screen")
    await page.pdf({
      path,
      printBackground: true,
      ...dimension,
    })
  }
  return path
}

const captureWithDevices = async function* ({
  page,
  captureTargets,
  captureSavePath,
  fileName,
}: {
  page: puppeteer.Page
  captureTargets: CaptureArgsType["captureTargets"]
  captureSavePath: string
  fileName: string | number
}) {
  for (const {
    output,
    device: { viewport, userAgent, name },
  } of captureTargets) {
    // デバイスをセット
    await page.emulate({
      viewport,
      userAgent,
    })

    const filePaths: string[] = []

    for (const out of output) {
      // キャプチャ
      const filePath = await capture(
        page,
        out,
        createFilePath(captureSavePath, fileName, name, out)
      )
      filePaths.push(filePath)
    }
    yield {
      filePaths,
      name,
    }
  }
}

const createCaptureHandler = (
  captureSavePath: string,
  page: puppeteer.Page
) => {
  // この関数外からキャンセルするので
  // 外からキャンセルされたことを`onCancel`を読んで知らせてもらう
  let canceled = false
  const onCancel = () => (canceled = true)

  const captureProcess: CaptureType = async ({
    fileName,
    captureTargets,
    url,
    onTitle,
  }) => {
    try {
      // ページに遷移
      const { status } = await gotoPage(page, url)
      const title = await page.title()
      onTitle(title)
      // 200系以外は返す
      if (!status) {
        return {
          status,
          results: null,
          error: EXPECTED_ERROR.statusErr,
        }
      }

      const results: {
        filePaths: string[]
        name: string
      }[] = []
      for await (const result of captureWithDevices({
        fileName,
        captureTargets,
        page,
        captureSavePath,
      })) {
        results.push(result)
      }
      return {
        status,
        results,
        error: null,
      }
    } catch (e) {
      const error = handleError(canceled, e)
      return {
        status: error,
        results: null,
        error,
      }
    }
  }

  return {
    onCancel,
    captureProcess,
  }
}

const createCancel = (
  browser: puppeteer.Browser,
  onCancel: (args?: any) => any
) => () => {
  const browserProcess = browser.process()
  browserProcess.kill("SIGHUP")
  onCancel()
}

export const createPuppeteerHandler = async ({
  executablePath,
  captureSavePath,
  launchOptions,
}: SettingsType): Promise<{
  capture: CaptureType
  cancel: CancelType
  closeBrowser: CloseType
}> => {
  const { browser, page } = await launchPuppeteer(executablePath, launchOptions)
  const { captureProcess, onCancel } = createCaptureHandler(
    captureSavePath,
    page
  )
  const cancel = createCancel(browser, onCancel)
  return {
    capture: captureProcess,
    cancel,
    closeBrowser: async () => await browser.close(),
  }
}
