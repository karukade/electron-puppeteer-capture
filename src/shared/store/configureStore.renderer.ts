import { IpcRenderer } from "electron"
import { createStore, applyMiddleware, Middleware } from "redux"
import { forwardToMain, replayActionRenderer } from "electron-redux"

import rootReducer from "../reducers/"

export default function configureStore(
  ipcRenderer: IpcRenderer,
  initialState: any
) {
  const middleware: Middleware[] = [forwardToMain(ipcRenderer)]

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
  )

  replayActionRenderer(ipcRenderer, store)

  return store
}
