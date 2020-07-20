import { channels } from "../shared/channels"

const { ipcRenderer } = window

export const requestInitialData = () => {
  ipcRenderer.invoke(channels.REQ_INIT_DATA)
}

export const readUrlsExcel = () => {
  ipcRenderer.invoke(channels.READ_URL_LIST)
}

export const setCaptureSavePath = () => {
  ipcRenderer.invoke(channels.SET_CAPTURE_SAVE_PATH)
}

export const startCapture = () => {
  ipcRenderer.invoke(channels.START_CAPTURE)
}

export const cancelCapture = () => {
  ipcRenderer.invoke(channels.CANCEL_CAPTURE)
}
