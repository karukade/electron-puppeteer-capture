import { ipcMain } from "electron"
import { actions } from "../common/actions"

import Logics from "./services/Logics"

const services = {
  logic: new Logics(),
}

export const handlers = {
  [actions.GET_INIT_DATA]: async () => {
    const logics = await services.logic.init()
    return "INIT_DATA"
  },

  [actions.READ_URL_LIST]: () => {
    return "READ_URL_LIST"
  },

  [actions.START_CAPTURE]: () => {
    return "START_CAPTURE"
  },
}

export const addIpcHandlers = () => {
  Object.entries(handlers).forEach(([key, handler]) => {
    ipcMain.handle(key, handler)
  })
}
