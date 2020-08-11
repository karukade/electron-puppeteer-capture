import path from "path"
import puppeteer from "puppeteer"

import * as utils from "../utils"
import { errCodes } from "../errHandler"

import { APP_NAME_PREFIX } from "./createCaptureHandler"

//types
import { DeviceInfoType } from "./devices"
import { CaptureTargetInfo } from "./urlListParser"
import { AuthInfo } from "./basicAuth"

export const EXPECTED_ERROR = {
  timeOut: "TIME_OUT",
  cancel: "CANCEL",
  statusErr: "STATUS_ERROR",
  crash: "BROWSER_CRASH",
  evalErr: "LOGIC_EVALUATE_ERROR",
  netErr: "NET_ERROR",
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

export type CreateCaptureHandlerArgsType = Pick<
  SettingsType,
  "captureSavePath"
> & {
  page: puppeteer.Page
}

export type CaptureArgsType = {
  url: string
  fileName: string | number
  captureTargets: { device: DeviceInfoType; output: OutputType[] }[]
  logic: CaptureTargetInfo["logic"]
  onTitle: (title: string) => void
  logicScript?: string
  basicAuth?: AuthInfo
}

export type CaptureType = (args: CaptureArgsType) => Promise<CaptureResultType>

type CancelType = () => void

type CloseType = () => Promise<void>

type ForDevicesArgs = Pick<
  CaptureArgsType,
  "captureTargets" | "fileName" | "logic" | "logicScript"
> & {
  page: puppeteer.Page
  captureSavePath: string
}

type ForDevicesResult = {
  filePaths: string[]
  name: string
}[]

type ForOutPutArgs = Pick<
  ForDevicesArgs,
  "captureSavePath" | "fileName" | "page"
> & {
  output: OutputType[]
  name: string
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
  meta?: {
    errorDetail?: string
  }
}

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

const handleError = (
  isCanceled: boolean,
  e?: Error & { message: string }
): {
  message: ExpectedErrorType
  stack?: string
} => {
  // 中断時
  if (detectCancelError(isCanceled, e)) {
    return {
      message: EXPECTED_ERROR.cancel,
    }
  }

  // タイムアウトエラー
  if (e?.message.includes("Navigation timeout")) {
    return {
      message: EXPECTED_ERROR.timeOut,
    }
  }

  // ページクラッシュ
  if (e?.message === "Page crashed!") {
    return {
      message: EXPECTED_ERROR.crash,
    }
  }

  // page.evaluate エラー
  if (e?.message === EXPECTED_ERROR.evalErr) {
    return {
      message: EXPECTED_ERROR.evalErr,
      stack: e?.stack,
    }
  }

  // ネットワーク系のエラー
  if (e?.message.includes("net::")) {
    return {
      message: EXPECTED_ERROR.netErr,
      stack: e?.message,
    }
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

type EvaluateArgs = Pick<ForDevicesArgs, "logicScript" | "logic" | "page">

export const evaluate = async ({ logicScript, logic, page }: EvaluateArgs) => {
  // ロジックをwindowに定義
  if (logicScript) {
    await page.addScriptTag({
      content: logicScript,
    })
  }

  // ページ内ロジックを実行
  if (logicScript && logic)
    return await page.evaluate(
      `;(async () => { await window.${APP_NAME_PREFIX}["${logic}"]() } )()`
    )
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

const forOutPuts = ({
  output,
  page,
  captureSavePath,
  fileName,
  name,
}: ForOutPutArgs) => {
  return output.reduce<Promise<string[]>>(async (prevResults, out) => {
    const filePaths = await prevResults
    const filePath = await capture(
      page,
      out,
      createFilePath(captureSavePath, fileName, name, out)
    )
    return [...filePaths, filePath]
  }, Promise.resolve([]))
}

const forDevices = async ({
  page,
  captureTargets,
  captureSavePath,
  fileName,
  logic,
  logicScript,
}: ForDevicesArgs) => {
  return captureTargets.reduce<Promise<ForDevicesResult>>(
    async (
      prevTaskResults,
      { output, device: { viewport, userAgent, name } },
      i
    ) => {
      const prevResults = await prevTaskResults

      // ロジックでページの状態が変わる可能性があるのでリロード
      if (i !== 0) await page.reload(PAGE_SETTINGS)

      // デバイスをセット
      await page.emulate({
        viewport,
        userAgent,
      })

      // ロジックを実行
      await evaluate({
        page,
        logic,
        logicScript,
      }).catch((e) => {
        const err = new Error(EXPECTED_ERROR.evalErr)
        err.stack = e.message
        throw err
      })

      // 各img/pdfごとにループ
      const filePaths = await forOutPuts({
        output,
        page,
        captureSavePath,
        fileName,
        name,
      })

      return [
        ...prevResults,
        {
          filePaths,
          name,
        },
      ]
    },
    Promise.resolve([])
  )
}

const createCaptureHandler = ({
  captureSavePath,
  page,
}: CreateCaptureHandlerArgsType) => {
  // この関数外からキャンセルするので
  // 外からキャンセルされたことを`onCancel`を読んで知らせてもらう
  let canceled = false
  const onCancel = () => (canceled = true)

  // 外から呼び出すキャプチャ関数
  const captureProcess: CaptureType = async ({
    fileName,
    captureTargets,
    url,
    logic,
    onTitle,
    logicScript,
    basicAuth,
  }) => {
    try {
      // basic認証があれば設定
      if (basicAuth) await page.authenticate(basicAuth)

      // ページに遷移
      const { status } = await gotoPage(page, url)

      // タイトルを取得してコールバック実行
      const title = await page.title()
      onTitle(title)

      // 200系以外はstatus error
      if (!status) {
        return {
          status,
          results: null,
          error: EXPECTED_ERROR.statusErr,
        }
      }

      // 各デイバイスごとにループしてキャプチャ
      const results = await forDevices({
        fileName,
        captureTargets,
        page,
        captureSavePath,
        logic,
        logicScript,
      })

      return {
        status,
        results,
        error: null,
      }
    } catch (e) {
      const { message, stack } = handleError(canceled, e)
      return {
        status: message,
        results: null,
        error: message,
        meta: {
          errorDetail: stack,
        },
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
  const { captureProcess, onCancel } = createCaptureHandler({
    captureSavePath,
    page,
  })
  const cancel = createCancel(browser, onCancel)
  return {
    capture: captureProcess,
    cancel,
    closeBrowser: async () => await browser.close(),
  }
}
