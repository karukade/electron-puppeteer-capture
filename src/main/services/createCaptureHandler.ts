import {
  createPuppeteerHandler,
  EXPECTED_ERROR,
  SettingsType,
  CaptureResultType,
  CaptureArgsType,
  CaptureType,
  OutputType,
} from "./createPuppeteerHandler"

// types
import { LogicsType } from "./logics"
import { UrlListType, CaptureTargetInfo, CaptureTarget } from "./urlListParser"
import { DeviceListsType, DeviceType } from "./devices"
import { AuthInfoDomainMap } from "./basicAuth"

export type OnCapturedArgsType = CaptureResultType & {
  index: CaptureTargetInfo["index"]
  canceled: boolean
}

export type CallBackType = {
  onStart: (index: number) => any
  onCaptured: (arg: OnCapturedArgsType) => any
  onTitle: (arg: { title: string; index: number }) => any
  onDone: (result: { canceled: boolean }) => any
}

export const APP_NAME_PREFIX = "__GLUTTON__"

// const isExpectedError = (err: CaptureResultType["error"]) => {
//   return (
//     err === EXPECTED_ERROR.cancel ||
//     err === EXPECTED_ERROR.crash ||
//     err === EXPECTED_ERROR.timeOut ||
//     err === EXPECTED_ERROR.statusErr
//   )
// }

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

type CreateCaptureArg = Pick<CaptureArgsType, "logicScript" | "logic"> &
  Pick<CreateCaptureStartArg, "basicAuthLists"> & {
    info: Pick<CaptureTargetInfo, "url" | "index" | "captureTargets">
    onTitle: CallBackType["onTitle"]
    deviceList: DeviceListsType
  }

const getUrl = (url: string) => new URL(url)

const createCaptureArg = ({
  info: { url, index, captureTargets },
  onTitle,
  deviceList,
  logic,
  logicScript,
  basicAuthLists,
}: CreateCaptureArg): CaptureArgsType => {
  const basicAuth = basicAuthLists && basicAuthLists.get(getUrl(url).host)
  return {
    url,
    fileName: index,
    captureTargets: formatCaptureTargets(captureTargets, deviceList),
    logic,
    logicScript,
    basicAuth,
    onTitle: (title) => {
      onTitle({
        index,
        title,
      })
    },
  }
}

const generateLogicScriptString = (logics: LogicsType) => `
  window.${APP_NAME_PREFIX} = {
    ${[...logics]
      .map(([name, logic]) => `${name}:() => { ${logic.value} }`)
      .join(",")}
  }
`

type CreateCaptureStartArg = Pick<
  CreateCaptureHandlerArgs,
  "deviceList" | "logics" | "basicAuthLists"
> & {
  capture: CaptureType
  closeBrowser: () => Promise<void>
}

const createCaptureStart = ({
  capture,
  deviceList,
  closeBrowser,
  logics,
  basicAuthLists,
}: CreateCaptureStartArg) => async (
  urlList: UrlListType,
  { onStart, onCaptured, onTitle, onDone }: CallBackType
) => {
  // windowに全てのロジックを定義するためのスクリプト
  const logicScript =
    logics && logics.size ? generateLogicScriptString(logics) : undefined
  // 戻り値はキャンセルされたかどうかのフラグ
  const canceled = await [...urlList].reduce<Promise<boolean>>(
    async (prev, [, { url, index, captureTargets, logic }]) => {
      // 前のタスクがキャンセルされたかどうかを確認
      // trueなら現在のタスクは実行せずreturnする
      const prevCanceled = await prev
      const hasLogic = logic && logics?.has(logic)
      if (prevCanceled) return prevCanceled

      onStart(index)

      const captureArg = createCaptureArg({
        info: { url, index, captureTargets },
        onTitle,
        deviceList,
        basicAuthLists,
        ...(hasLogic
          ? {
              logic,
              logicScript,
            }
          : {
              logic,
              logicScript: undefined,
            }),
      })

      const { canceled, result } = await takeCapture(capture, captureArg)
      onCaptured({ ...result, index, canceled })
      return canceled
    },
    Promise.resolve(false) // 初期値はダミー
  )
  onDone({ canceled })
  await closeBrowser()
}

export type CreateCaptureHandlerArgs = {
  settings: SettingsType
  deviceList: DeviceListsType
  logics: LogicsType | null
  basicAuthLists: AuthInfoDomainMap
}

export const createCaptureHandler = async ({
  settings,
  deviceList,
  logics,
  basicAuthLists,
}: CreateCaptureHandlerArgs) => {
  const { cancel, capture, closeBrowser } = await createPuppeteerHandler(
    settings
  )
  const start = createCaptureStart({
    capture,
    deviceList,
    closeBrowser,
    logics,
    basicAuthLists,
  })
  return {
    start,
    cancel,
  }
}
