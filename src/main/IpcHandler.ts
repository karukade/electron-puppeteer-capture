import { ipcMain } from "electron"
import { actions } from "../common/actions"

export const addIpcHandlers = () => {
  ipcMain.handle(actions.GET_INIT_DATA, () => {
    return { result: "INIT_DATA" }
  })
}
