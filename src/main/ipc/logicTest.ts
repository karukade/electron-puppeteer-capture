import path from "path"
import { Store } from "redux"
import { userDataDir, hasDirOrFile, fsPromises } from "../utils"

// service
import { createCaptureHandler } from "../services/createCaptureHandler"
import { createLogicTestUrlList, isValidUrl } from "../services/urlListParser"

// store selectors
import { getCaptureData } from "../../shared/selectors/"

//types
import { StateType } from "../../shared/reducers"
import { DeviceType } from "../services/devices"
import { LogicsType } from "../services/logics"
import { OnCapturedArgsType } from "../services/createCaptureHandler"
import {
  EXPECTED_ERROR,
  CaptureResultType,
} from "../services/createPuppeteerHandler"

type ErrorTypes =
  | CaptureResultType["error"]
  | "CHROMIUM_NOT_FOUND"
  | "INVALID_URL"

const getLogicName = () => String(new Date().getTime())

const messages = {
  BROWSER_CRASH:
    "ブラウサがクラッシュしてテストに失敗しました。再度試してください。",
  TIME_OUT:
    "タイムアウトでページを開けませんでした。URLが誤っていないかご確認ください。",
  LOGIC_EVALUATE_ERROR: "ロジックの実行に失敗しました。",
  NET_ERROR:
    "何らかの理由によりページを開ませんでした。URLが誤っていないかご確認ください。",
  STATUS_ERROR: (status: string | number | null) =>
    `${status}エラーでテストを実行できませんでした。URLが誤っていないかご確認ください。`,
  INVALID_URL: "不正なURLです。URLが誤っていないかご確認ください。",
  CHROMIUM_NOT_FOUND:
    "ブラウザが見つかりません。アプリを再起動してみてください。",
  CANCEL: "",
}

const formatResult = (
  result: CaptureResultType
): {
  message: string
  stack?: string
  error: ErrorTypes
} => {
  const { error, meta, status } = result
  if (!error)
    return {
      error,
      message: "ロジックは問題なく実行されました。",
    }

  switch (error) {
    case EXPECTED_ERROR.statusErr:
      return {
        error,
        message: messages[error](status),
        stack: meta?.errorDetail,
      }

    default:
      return {
        error,
        message: messages[error],
        stack: meta?.errorDetail,
      }
  }
}

export type ForMattedResultType = ReturnType<typeof formatResult>

export const logicTest = async (
  store: Store<StateType>,
  logic: string,
  url: string,
  device?: DeviceType
): Promise<ForMattedResultType> => {
  console.log(url, "url")
  if (!isValidUrl(url))
    return {
      error: "INVALID_URL",
      message: messages.INVALID_URL,
    }
  const testLogicName = getLogicName()
  const testLogicInfo = {
    name: testLogicName,
    value: logic,
  }
  const captureSavePath = path.join(userDataDir, "/temp")
  const {
    executablePath,
    deviceList,
    basicAuthLists,
    logics: storeLogics,
  } = getCaptureData(store.getState())
  if (!executablePath)
    return {
      message: messages.CHROMIUM_NOT_FOUND,
      error: "CHROMIUM_NOT_FOUND",
    }

  if (!(await hasDirOrFile(captureSavePath))) {
    await fsPromises.mkdir(captureSavePath, { recursive: true })
  }

  const logics: LogicsType = storeLogics
    ? new Map(storeLogics).set(testLogicName, testLogicInfo)
    : new Map([[testLogicName, testLogicInfo]])

  const urlList = createLogicTestUrlList(url, testLogicName, device)

  const { start } = await createCaptureHandler({
    settings: {
      captureSavePath,
      executablePath,
      launchOptions: {
        headless: false,
      },
    },
    deviceList,
    logics,
    basicAuthLists,
  })

  let resolve: (arg: OnCapturedArgsType) => void

  const onCapturedPromise = new Promise<OnCapturedArgsType>(
    (_resolve) => (resolve = _resolve)
  )

  start(urlList, {
    onCaptured: (results) => resolve(results),
    onTitle: () => null,
    onDone: () => null,
    onStart: () => null,
  })

  const result = await onCapturedPromise

  return formatResult(result)
}
