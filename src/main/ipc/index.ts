import { ipcMain, IpcMainInvokeEvent } from "electron"
import { Store } from "redux"

// channels
import { channels, ChannelsType } from "../../shared/channels"

// operations
import { initData } from "./initData"
import { readUrlList } from "./readUrlList"
import { setCaptureSavePath, startCapture, resetCaptureState } from "./capture"
import { setLogics, updateLogics } from "./logics"
import { logicTest } from "./logicTest"

// types
import { StateType } from "../../shared/reducers/"
import { LogicInfo, UpdateLogicArg } from "../services/logics"

type HandlerArgType = {
  store: Store<StateType>
  event: IpcMainInvokeEvent
  args: any[]
}

type HandlersType = {
  [K in ChannelsType]?: (arg: HandlerArgType) => any
}

const createHandlers = (): HandlersType => ({
  // renderer初期化用のデータをstoreにセット
  [channels.REQ_INIT_DATA]: async ({ store }) => {
    await initData(store)
  },

  [channels.READ_URL_LIST]: async ({ store }) => {
    await readUrlList(store)
  },

  [channels.SET_CAPTURE_SAVE_PATH]: async ({ store, args }) => {
    const [sameAsUrlListPath] = args as [boolean]
    await setCaptureSavePath(store, sameAsUrlListPath)
  },

  [channels.START_CAPTURE]: async ({ store }) => {
    await startCapture(store)
  },

  [channels.RESET_CAPTURE_STATE]: ({ store }) => {
    resetCaptureState(store)
  },

  [channels.SET_LOGIC]: async ({ store, args }) => {
    const logic = args[0] as LogicInfo
    console.log(logic)
    setLogics(store, logic)
  },

  [channels.UPDATE_LOGIC]: async ({ store, args }) => {
    const [{ logic, lastLogicName }] = args as [
      {
        logic: UpdateLogicArg["logic"]
        lastLogicName: UpdateLogicArg["lastLogicName"]
      }
    ]
    updateLogics(store, logic, lastLogicName)
  },

  [channels.LOGIC_TEST]: async ({ store, args }) => {
    const [url, logic] = args as [string, string]
    return await logicTest(store, logic, url)
  },
})

export const addIpcHandlers = (appStore: Store<StateType>) => {
  const handlers = createHandlers()
  Object.entries(handlers).forEach(([key, handler]) => {
    if (!handler) return
    ipcMain.handle(key, (event, ...args) =>
      handler({
        store: appStore,
        args,
        event,
      })
    )
  })
}
