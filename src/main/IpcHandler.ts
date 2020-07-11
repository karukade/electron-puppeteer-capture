import { ipcMain } from "electron"
import { channels, ChannelsType } from "../shared/channels"
import { Store } from "redux"

import { errCodes } from "./errHandler"

import { getInitializeData } from "./services/appInitializer"
import { readExcel } from "./services/excelParser"
import { showFileSelectDialog } from "./dialog"

// store actions
import {
  setChromiumExecutablePath,
  setChromiumInitialized,
} from "../shared/actions/chromium"
import { setLogics } from "../shared/actions/logics"
import { setUrlList } from "../shared/actions/urls"

let store: Store

export const handlers = {
  [channels.REQ_INIT_DATA]: async () => {
    const { chromiumExecutablePath, logics } = await getInitializeData()
    store.dispatch(setChromiumInitialized(true))
    store.dispatch(setChromiumExecutablePath(chromiumExecutablePath))
    store.dispatch(setLogics(logics))
  },

  [channels.READ_URL_LIST]: async () => {
    const filePath = await showFileSelectDialog()
    if (!filePath) return
    store.dispatch(setUrlList.started())
    try {
      const urlList = await readExcel(filePath)
      store.dispatch(setUrlList.done({ result: urlList }))
    } catch (e) {
      if (e.message === errCodes.INVALID_EXCEL)
        return store.dispatch(setUrlList.failed({ error: true }))
      throw e
    }
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
