import { IpcRenderer } from "electron"
import { createStore, applyMiddleware, compose, Middleware } from "redux"
import {
  forwardToMain,
  replayActionRenderer,
} from "@karukade/electron-redux-ts"

import rootReducer, { StateType } from "../reducers/"

export default function configureStore(
  ipcRenderer: IpcRenderer,
  initialState: StateType
) {
  const middleware: Middleware[] = [forwardToMain(ipcRenderer)]
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancer(applyMiddleware(...middleware))
  )

  replayActionRenderer(ipcRenderer, store)

  return store
}
