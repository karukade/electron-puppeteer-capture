import path from "path"
import sizeOf from "image-size"
import puppeteer from "puppeteer"

import { hasDirOrFile, userDataDir, fsPromises } from "../../utils"
import {
  extractChromium,
  getChromiumExecutablePath,
} from "../browserInitializer"
import {
  createPuppeteerHandler,
  evaluate,
  ExpectedErrorType,
  LaunchOptionsType,
  EXPECTED_ERROR,
} from "../createPuppeteerHandler"

import { APP_NAME_PREFIX } from "../createCaptureHandler"

const captureSavePath = path.join(userDataDir, "capture")
const device = {
  type: "pc",
  viewport: {
    width: 1360,
    height: 768,
    hasTouch: false,
    deviceScaleFactor: 1,
    isLandscape: false,
    isMobile: false,
  },
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36",
  name: "Chrome",
} as const

let executablePath!: string

const initPuppeteerLauncher = (launchOptions?: LaunchOptionsType) => {
  return createPuppeteerHandler({
    executablePath,
    captureSavePath,
    launchOptions,
  })
}

beforeAll(async () => {
  const [_executablePath] = await Promise.all([
    extractChromium().then(getChromiumExecutablePath),
    fsPromises.mkdir(captureSavePath, { recursive: true }),
  ])
  executablePath = _executablePath
})

afterAll(() => {
  return fsPromises.rmdir(userDataDir, { recursive: true })
})

describe("puppeteerLauncher.capture", () => {
  test("デバイス幅でキャプチャする", async () => {
    const puppeteerLauncher = await initPuppeteerLauncher()
    const { results } = await puppeteerLauncher.capture({
      url: "https://google.com",
      fileName: "test",
      onTitle: () => undefined,
      logic: null,
      captureTargets: [
        {
          device,
          output: ["img"],
        },
      ],
    })

    const filePath = results?.[0].filePaths?.[0] as string

    await puppeteerLauncher.closeBrowser()
    expect(await hasDirOrFile(filePath)).toBe(true)

    const { width } = sizeOf.imageSize(filePath)
    expect(width).toBe(device.viewport.width)
  }, 20000)

  test("pdfで出力する", async () => {
    const puppeteerLauncher = await initPuppeteerLauncher({ headless: true })
    const { results } = await puppeteerLauncher.capture({
      url: "https://google.com/",
      fileName: "test",
      onTitle: () => undefined,
      logic: null,
      captureTargets: [
        {
          device,
          output: ["img"],
        },
      ],
    })
    const filePath = results?.[0].filePaths?.[0] as string
    await puppeteerLauncher.closeBrowser()
    expect(await hasDirOrFile(filePath)).toBe(true)
  }, 20000)

  test("not found", async () => {
    const puppeteerLauncher = await initPuppeteerLauncher()
    const { status } = await puppeteerLauncher.capture({
      url: "https://google.com/hoge",
      fileName: "test",
      logic: null,
      onTitle: () => undefined,
      captureTargets: [
        {
          device,
          output: ["img"],
        },
      ],
    })

    await puppeteerLauncher.closeBrowser()

    expect(status).toEqual(404)
  })
})

describe("puppeteerLauncher.cancel", () => {
  test("キャプチャ途中であっても強制終了", async () => {
    expect.assertions(1)

    const puppeteerLauncher = await initPuppeteerLauncher()

    const captureLoop = async () => {
      // eslint-disable-next-line no-constant-condition
      let _error: null | ExpectedErrorType | string = null
      while (_error === null) {
        const { error } = await puppeteerLauncher.capture({
          url: "https://google.com",
          fileName: "test",
          logic: null,
          onTitle: () => undefined,
          captureTargets: [
            {
              device,
              output: ["img"],
            },
          ],
        })
        _error = error
      }
      return _error
    }

    setTimeout(() => {
      puppeteerLauncher.cancel()
    }, 2000)

    expect(await captureLoop()).toEqual(EXPECTED_ERROR.cancel)
  }, 20000)
})

describe("evaluate", () => {
  test("page.addScriptTagとpage.evaluateを実行する", async () => {
    const logic = "logic"
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const logicScript = `
      window.${APP_NAME_PREFIX} = {
        ${logic}: () => { return "${logic}" }
      }
    `
    const result = await evaluate({
      logicScript,
      logic,
      page,
    })

    await browser.close()

    expect(result).toBe(logic)
  })
})
