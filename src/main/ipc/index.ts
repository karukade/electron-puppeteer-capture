import { ipcMain, IpcMainInvokeEvent } from "electron"
import { Store } from "redux"

// channels
import { channels, ChannelsType } from "../../shared/channels"

// operations
import { initData } from "./initData"
import { readUrlList, downloadUrlList } from "./urlList"
import { setCaptureSavePath, startCapture, resetCaptureState } from "./capture"
import { setLogics, updateLogics } from "./logics"
import { logicTest } from "./logicTest"

// types
import { StateType } from "../../shared/reducers/"
import { UpdateLogicArg } from "../services/logics"

interface IpcHandlerType {
  (store: Store<StateType>, event: IpcMainInvokeEvent): any
}

type HandlersType = {
  readonly [K in ChannelsType]?: {
    (store: Store<StateType>, event: IpcMainInvokeEvent, ...args: any[]): any
  }
}

const handlers: HandlersType = {
  // renderer初期化用のデータをstoreにセット
  [channels.REQ_INIT_DATA]: (store) => {
    initData(store)
  },

  [channels.READ_URL_LIST]: (store) => {
    readUrlList(store)
  },

  [channels.SET_CAPTURE_SAVE_PATH]: (
    store,
    event,
    sameAsUrlListPath: boolean
  ) => {
    setCaptureSavePath(store, sameAsUrlListPath)
  },

  [channels.START_CAPTURE]: (store) => {
    startCapture(store)
  },

  [channels.RESET_CAPTURE_STATE]: (store) => {
    resetCaptureState(store)
  },

  [channels.SET_LOGIC]: (store, event, logic) => {
    setLogics(store, logic)
  },

  [channels.UPDATE_LOGIC]: (
    store,
    event,
    {
      logic,
      lastLogicName,
    }: {
      logic: UpdateLogicArg["logic"]
      lastLogicName: UpdateLogicArg["lastLogicName"]
    }
  ) => {
    updateLogics(store, logic, lastLogicName)
  },

  [channels.LOGIC_TEST]: (store, event, [url, logic]: string[]) => {
    return logicTest(store, logic, url)
  },

  [channels.DOWNLOAD_URL_LIST]: async () => {
    downloadUrlList()
  },
}

export const addIpcHandlers = (appStore: Store<StateType>) => {
  Object.entries(handlers).forEach(([channel, handler]) => {
    if (!handler) return
    ipcMain.handle(channel, (event, ...args) =>
      handler.apply(null, [appStore, event, ...args])
    )
  })
}
