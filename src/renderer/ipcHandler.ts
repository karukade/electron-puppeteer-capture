import { channels } from "../shared/channels"
import { LogicInfo, UpdateLogicArg } from "../main/services/logics"

//types
import { ForMattedResultType } from "../main/ipc/logicTest"

const { ipcRenderer } = window

export const requestInitialData = () => {
  ipcRenderer.invoke(channels.REQ_INIT_DATA)
}

export const readUrlsExcel = () => {
  ipcRenderer.invoke(channels.READ_URL_LIST)
}

export const setCaptureSavePath = (sameAsUrlListPath?: boolean) => {
  ipcRenderer.invoke(channels.SET_CAPTURE_SAVE_PATH, sameAsUrlListPath)
}

export const startCapture = () => {
  ipcRenderer.invoke(channels.START_CAPTURE)
}

export const cancelCapture = () => {
  ipcRenderer.send(channels.CANCEL_CAPTURE)
}

export const resetCaptureState = () => {
  ipcRenderer.invoke(channels.RESET_CAPTURE_STATE)
}

export const setLogic = (logic: LogicInfo) => {
  ipcRenderer.invoke(channels.SET_LOGIC, logic)
}

export const updateLogic = (updateInfos: {
  logic: UpdateLogicArg["logic"]
  lastLogicName: UpdateLogicArg["lastLogicName"]
}) => {
  ipcRenderer.invoke(channels.UPDATE_LOGIC, updateInfos)
}

export const logicTest = (
  url: string,
  logic: string
): Promise<ForMattedResultType> => {
  return ipcRenderer.invoke(channels.LOGIC_TEST, url, logic)
}

export const downloadUrlList = () => {
  return ipcRenderer.invoke(channels.DOWNLOAD_URL_LIST)
}
