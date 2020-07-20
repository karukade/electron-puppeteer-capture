import {
  createPuppeteerHandler,
  EXPECTED_ERROR,
  SettingsType,
  CaptureResultType,
  CaptureArgsType,
  CaptureType,
  OutputType,
} from "./createPuppeteerHandler"
import { UrlListType, CaptureTargetInfo, CaptureTarget } from "./urlListParser"
import { DeviceListsType, DeviceType } from "./devices"

export type OnCapturedArgsType = CaptureResultType & {
  index: CaptureTargetInfo["index"]
}

export type CallBackType = {
  onStart: (index: number) => any
  onCaptured: (arg: OnCapturedArgsType) => any
  onTitle: (arg: { title: string; index: number }) => any
}

// const formatUrlListToCaptureArg = ({
//   url,
//   fileName,
//   captureTargets,
//   deviceList,
// }: {
//   url: CaptureArgsType["url"]
//   fileName: CaptureArgsType["fileName"]
//   captureTargets: CaptureTarget[]
//   deviceList: DeviceListsType
// }): CaptureArgsType =>
//   captureTargets
//     .map((target) => {
//       const deviceTargets = deviceList[target.device].map((device) => ({
//         device,
//         output: target.output,
//       }))
//       return {
//         url,
//         fileName,
//         captureTargets: deviceTargets,
//       }
//     })
//     .flat()

const isExpectedError = (err: CaptureResultType["error"]) => {
  return (
    err === EXPECTED_ERROR.cancel ||
    err === EXPECTED_ERROR.crash ||
    err === EXPECTED_ERROR.timeOut ||
    err === EXPECTED_ERROR.statusErr
  )
}

const isCanceled = (err: CaptureResultType["error"]) =>
  err === EXPECTED_ERROR.cancel || err === EXPECTED_ERROR.crash

const takeCapture = async (capture: CaptureType, arg: CaptureArgsType) => {
  const result = await capture(arg)
  return { result, canceled: isCanceled(result.error) }
}

const formatCaptureTargets = (
  captureTargets: CaptureTarget,
  deviceList: DeviceListsType
): CaptureArgsType["captureTargets"] => {
  return Object.entries(captureTargets)
    .map(([device, output]) => {
      const devices = deviceList[device as DeviceType]
      const _output = output as OutputType[]
      return devices.map((descriptor) => ({
        device: descriptor,
        output: _output,
      }))
    })
    .flat()
}

const createCaptureStart = (
  capture: CaptureType,
  deviceList: DeviceListsType,
  closeBrowser: () => Promise<void>
) => async (
  urlList: UrlListType,
  { onStart, onCaptured, onTitle }: CallBackType
) => {
  for (const [, { index, url, captureTargets }] of urlList) {
    onStart(index)
    const captureArg: CaptureArgsType = {
      url,
      fileName: index,
      captureTargets: formatCaptureTargets(captureTargets, deviceList),
      onTitle: (title) => {
        onTitle({
          index,
          title,
        })
      },
    }
    const { canceled, result } = await takeCapture(capture, captureArg)
    onCaptured({ ...result, index })
    if (canceled) break
  }
  await closeBrowser()
}

export const createCaptureHandler = async (
  settings: SettingsType,
  deviceList: DeviceListsType
) => {
  const { cancel, capture, closeBrowser } = await createPuppeteerHandler(
    settings
  )
  const start = createCaptureStart(capture, deviceList, closeBrowser)
  return {
    start,
    cancel,
  }
}
