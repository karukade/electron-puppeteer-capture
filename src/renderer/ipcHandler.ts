import { channels } from "../shared/channels"

const { ipcRenderer } = window

export const requestInitialData = async () => {
  ipcRenderer.invoke(channels.REQ_INIT_DATA)
}
