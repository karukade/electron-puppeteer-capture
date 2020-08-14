import path from "path"
import { ipcMain } from "electron"
import { Store } from "redux"
import { showDirSelectDialog } from "../dialog"

// channel
import { channels } from "../../shared/channels"

// service
import { createCaptureHandler } from "../services/createCaptureHandler"

// store selectors
import { getCaptureData } from "../../shared/selectors/"

// store actions
import {
  setCaptureSavePath as actionSetCaptureSavePath,
  setCaptureState,
} from "../../shared/actions/capture"
import { upDateUrlList, resetUrlList } from "../../shared/actions/urls"

//types
import { StateType } from "../../shared/reducers"

export const setCaptureSavePath = async (
  store: Store<StateType>,
  sameAsCaptureSavePath: boolean
) => {
  const urlListPath = store.getState().urls.path
  const filePath = sameAsCaptureSavePath
    ? urlListPath && path.dirname(urlListPath)
    : await showDirSelectDialog()
  if (!filePath) return
  store.dispatch(actionSetCaptureSavePath(filePath))
}

export const startCapture = async (store: Store<StateType>) => {
  const {
    urlList,
    captureSavePath,
    executablePath,
    deviceList,
    logics,
    basicAuthLists,
  } = getCaptureData(store.getState())
  if (!urlList || !captureSavePath || !executablePath) return

  const { start, cancel } = await createCaptureHandler({
    settings: { captureSavePath, executablePath },
    deviceList,
    logics,
    basicAuthLists,
  })
  start(urlList, {
    onStart: (index) => {
      store.dispatch(upDateUrlList({ index, capturing: true }))
    },
    onCaptured: ({ canceled, ...result }) => {
      store.dispatch(
        upDateUrlList({
          ...result,
          capturing: false,
          done: canceled ? false : true,
        })
      )
    },
    onTitle: (result) => {
      store.dispatch(upDateUrlList({ ...result }))
    },
    onDone: ({ canceled }) => {
      ipcMain.removeListener(channels.CANCEL_CAPTURE, cancel)
      store.dispatch(setCaptureState(canceled ? "stop" : "done"))
    },
  })
  store.dispatch(setCaptureState("progress"))
  ipcMain.once(channels.CANCEL_CAPTURE, () => {
    cancel()
    store.dispatch(setCaptureState("stopping"))
  })
}

export const resetCaptureState = (store: Store<StateType>) => {
  store.dispatch(actionSetCaptureSavePath(null))
  store.dispatch(setCaptureState("idle"))
  store.dispatch(resetUrlList())
}
