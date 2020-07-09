import { ipcMain } from "electron"
import { channels, ChannelsType } from "../shared/channels"
import { Store } from "redux"

import { getInitializeData } from "./services/appInitializer"

import {
  setChromiumExecutablePath,
  setChromiumInitialized,
} from "../shared/actions/chromium"
import { setLogics } from "../shared/actions/logics"

type Handlers = {
  [K in ChannelsType]: (args?: any) => any
}

let store: Store

export const handlers = {
  [channels.REQ_INIT_DATA]: async () => {
    const { chromiumExecutablePath, logics } = await getInitializeData()
    store.dispatch(setChromiumInitialized(true))
    store.dispatch(setChromiumExecutablePath(chromiumExecutablePath))
    store.dispatch(setLogics(logics))
  },

  [channels.READ_URL_LIST]: () => {
    return "READ_URL_LIST"
  },

  [channels.START_CAPTURE]: () => {
    return "START_CAPTURE"
  },
}

export const addIpcHandlers = (appStore: Store) => {
  if (!store) store = appStore
  Object.entries(handlers).forEach(([key, handler]) => {
    ipcMain.handle(key, handler)
  })
}
