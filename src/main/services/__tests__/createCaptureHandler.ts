import { mocked } from "ts-jest/utils"
import { DeviceType } from "../devices"
import {
  createPuppeteerHandler,
  CaptureArgsType,
  CaptureResultType,
  OutputType,
} from "../createPuppeteerHandler"
import {
  createCaptureHandler,
  OnCapturedArgsType,
} from "../createCaptureHandler"

import { DeviceListsType } from "../devices"
import { UrlListType } from "../urlListParser"
import { url } from "inspector"

jest.mock("../createPuppeteerHandler")

const mockedCreatePuppeteerHandler = mocked(createPuppeteerHandler)
const executablePath = "executablePath"
const captureSavePath = "captureSavePath"
const deviceList: DeviceListsType = {
  pc: [
    {
      type: "pc",
      name: "hoge",
      viewport: {
        width: 100,
        hasTouch: false,
        height: 100,
        deviceScaleFactor: 1,
        isMobile: false,
        isLandscape: false,
      },
      userAgent: "hoge",
    },
  ],
  sp: [
    {
      type: "sp",
      name: "hoge",
      viewport: {
        width: 100,
        hasTouch: false,
        height: 100,
        deviceScaleFactor: 1,
        isMobile: false,
        isLandscape: false,
      },
      userAgent: "hoge",
    },
  ],
  tablet: [
    {
      type: "tablet",
      name: "hoge",
      viewport: {
        width: 100,
        hasTouch: false,
        height: 100,
        deviceScaleFactor: 1,
        isMobile: false,
        isLandscape: false,
      },
      userAgent: "hoge",
    },
  ],
}
const captureTargetDevices = ["pc", "sp", "tablet"] as const

const urlList: UrlListType = new Map(
  new Array(3).fill(0).map((_empty, i) => {
    return [
      i,
      {
        title: "",
        url: "hoge",
        index: i,
        invalidUrl: false,
        done: false,
        status: null,
        capturing: false,
        captureTargets: {
          pc: ["img"],
          sp: ["img"],
          tablet: ["img"],
        },
        logic: "",
      },
    ]
  })
)

const settings = {
  executablePath,
  captureSavePath,
}

const captureResult: CaptureResultType = {
  error: null,
  results: [
    {
      filePaths: ["hoge"],
      name: "hoge",
    },
  ],
  status: 200,
}

describe("createCaptureHandler", () => {
  test("受け取った引数をcreatePuppeteerHandlerに渡して実行する", async () => {
    mockedCreatePuppeteerHandler.mockResolvedValueOnce({
      capture: () => Promise.resolve(captureResult),
      cancel: () => undefined,
      closeBrowser: () => Promise.resolve(),
    } as any)
    await createCaptureHandler(settings, deviceList)
    expect(mockedCreatePuppeteerHandler).toHaveBeenCalledWith(settings)
  })
})

describe("createCaptureHandler().start()", () => {
  test("createPuppeteerHandlerのcapture関数をurlListの分だけ実行する", async () => {
    const mockedCaptureFunc = jest.fn().mockImplementation(({ onTitle }) => {
      onTitle()
      return Promise.resolve(captureResult)
    })
    const mockOnTitle = jest.fn()
    const mockOnCaptured = jest.fn()
    const mockCaptureStart = jest.fn()
    const mockCloseBrowser = jest.fn().mockResolvedValueOnce(undefined)
    const mockOnDone = jest.fn()

    mockedCreatePuppeteerHandler.mockResolvedValue({
      capture: mockedCaptureFunc,
      cancel: () => undefined,
      closeBrowser: mockCloseBrowser,
    } as any)

    const expectedCalledWith = [...urlList].map(
      ([, { index, captureTargets, url }]) => {
        const targets = Object.entries(captureTargets)
          .map(([device, output]) => {
            const devices = deviceList[device as DeviceType]
            const _output = output as OutputType[]
            return devices.map((descriptor) => ({
              device: descriptor,
              output: _output,
            }))
          })
          .flat()
        return [
          {
            url,
            fileName: index,
            captureTargets: targets,
            onTitle: expect.any(Function),
          } as CaptureArgsType,
        ]
      }
    )

    const onCapturedExpectedCalledWith: OnCapturedArgsType[][] = new Array(
      urlList.size
    )
      .fill(0)
      .map((_empty, i) => [
        {
          ...captureResult,
          index: urlList.get(i)?.index as number,
          canceled: false,
        },
      ])

    const { start } = await createCaptureHandler(settings, deviceList)
    await start(urlList, {
      onStart: mockCaptureStart,
      onCaptured: mockOnCaptured,
      onDone: mockOnDone,
      onTitle: mockOnTitle,
    })

    // console.log(mockedCaptureFunc.mock.calls)
    // console.log(expectedCalledWith)

    expect(mockedCaptureFunc).toBeCalledTimes(expectedCalledWith.length)
    expect(mockedCaptureFunc.mock.calls).toEqual(expectedCalledWith)
    expect(mockOnTitle).toBeCalledTimes(expectedCalledWith.length)
    expect(mockCaptureStart).toBeCalledTimes(urlList.size)
    expect(mockCaptureStart.mock.calls).toEqual(
      new Array(urlList.size)
        .fill(0)
        .map((_empty, i) => [urlList.get(i)?.index])
    )
    expect(mockOnCaptured).toBeCalledTimes(urlList.size)
    expect(mockOnCaptured.mock.calls).toEqual(onCapturedExpectedCalledWith)
    expect(mockOnDone).toBeCalledTimes(1)
    expect(mockOnDone).toBeCalledWith({ canceled: false })
    expect(mockCloseBrowser).toBeCalledTimes(1)
  })
})

describe("createCaptureHandler().cancel()", () => {
  test("puppeteerHandler().cancelを実行する", async () => {
    const mockedCancelFunc = jest.fn().mockReturnValueOnce(undefined)

    mockedCreatePuppeteerHandler.mockResolvedValue({
      capture: () => Promise.resolve(captureResult),
      cancel: mockedCancelFunc,
      closeBrowser: () => Promise.resolve(),
    } as any)

    const { cancel } = await createCaptureHandler(settings, deviceList)
    cancel()
    expect(mockedCancelFunc).toBeCalledTimes(1)
  })
})
