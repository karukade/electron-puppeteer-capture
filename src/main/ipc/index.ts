import { ipcMain, IpcMainInvokeEvent } from "electron"
import { Store } from "redux"

import { channels, ChannelsType } from "../../shared/channels"

import { initData } from "./initData"
import { readUrlList } from "./readUrlList"
import { setCaptureSavePath, startCapture } from "./capture"

import { StateType } from "../../shared/reducers/"

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

  [channels.SET_CAPTURE_SAVE_PATH]: async ({ store }) => {
    await setCaptureSavePath(store)
  },

  [channels.START_CAPTURE]: async ({ store }) => {
    await startCapture(store)
  },
})

export const addIpcHandlers = (appStore: Store<StateType>) => {
  const handlers = createHandlers()
  Object.entries(handlers).forEach(([key, handler]) => {
    if (!handler) return
    ipcMain.handle(key, (event, ...args) => {
      handler({
        store: appStore,
        args,
        event,
      })
    })
  })
}
