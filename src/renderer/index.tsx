import React from "react"
import { Provider } from "react-redux"
import { render } from "react-dom"
import { getInitialStateRenderer } from "electron-redux"

import App from "./App"
import configureStore from "../shared/store/configureStore.renderer"

const { ipcRenderer } = window

getInitialStateRenderer(ipcRenderer).then((initialState) => {
  const store = configureStore(ipcRenderer, initialState)
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("app")
  )
})
