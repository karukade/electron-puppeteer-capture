import { IpcRenderer } from "electron"
import { createStore, applyMiddleware, Middleware } from "redux"
import { forwardToMain, replayActionRenderer } from "electron-redux"

import rootReducer, { StateType } from "../reducers/"

export default function configureStore(
  ipcRenderer: IpcRenderer,
  initialState: StateType
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
