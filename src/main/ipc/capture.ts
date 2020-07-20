import { ipcMain } from "electron"
import { Store } from "redux"
import { showDirSelectDialog } from "../dialog"

import { createCaptureHandler } from "../services/createCaptureHandler"
import { channels } from "../../shared/channels"

// store selectors
import { getCaptureData } from "../../shared/selectors/"

// store actions
import { setCaptureSavePath as setCaptureSavePathAction } from "../../shared/actions/chromium"
import { upDateUrlList } from "../../shared/actions/urls"

export const setCaptureSavePath = async (store: Store) => {
  const filePath = await showDirSelectDialog()
  if (!filePath) return
  store.dispatch(setCaptureSavePathAction(filePath))
}

export const startCapture = async (store: Store) => {
  const { urlList, captureSavePath, executablePath, devices } = getCaptureData(
    store
  )
  if (!urlList || !captureSavePath || !executablePath) return

  const { start, cancel } = await createCaptureHandler(
    { captureSavePath, executablePath },
    devices
  )
  start(urlList, {
    onStart: (index) => {
      store.dispatch(upDateUrlList({ index, capturing: true }))
    },
    onCaptured: (result) => {
      store.dispatch(upDateUrlList({ ...result, capturing: false, done: true }))
    },
    onTitle: (result) => {
      store.dispatch(upDateUrlList({ ...result }))
    },
  })
  ipcMain.once(channels.CANCEL_CAPTURE, () => {
    cancel()
  })
}
