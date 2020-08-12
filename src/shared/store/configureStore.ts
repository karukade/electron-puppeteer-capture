import { createStore, applyMiddleware, Middleware } from "redux"
import {
  forwardToRenderer,
  replayActionMain,
} from "@karukade/electron-redux-ts"
import { ipcMain, webContents } from "electron"

import rootReducer from "../reducers/"

export default function configureStore() {
  const middleware: Middleware[] = [forwardToRenderer(webContents)]

  const store = createStore(rootReducer, applyMiddleware(...middleware))
  replayActionMain(ipcMain, store)

  return store
}
