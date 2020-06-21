import { BrowserWindow, BrowserWindowConstructorOptions } from "electron"
import * as path from "path"
import { format as formatUrl } from "url"

import utils from "./utils"

type BrowserWindowType = typeof BrowserWindow
export type MainWindowCallBacks = {
  onClose: () => void
}

const browserWindowOptions: BrowserWindowConstructorOptions = {
  width: 1180,
  height: 700,
  webPreferences: {
    nodeIntegration: utils.isDevelopment ? true : false,
    // dist/main/preload.js
    preload: path.resolve(__dirname, "..", "..", "dist", "main", "preload.js"),
  },
}

export const createMainWindow = (
  BrowserWindow: BrowserWindowType,
  callBacks?: MainWindowCallBacks
) => {
  const window = new BrowserWindow(browserWindowOptions)

  if (utils.isDevelopment) {
    window.webContents.openDevTools()
  }

  window.webContents.openDevTools()

  if (utils.isDevelopment) {
    window.loadURL(`http://localhost:8080`)
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      })
    )
  }

  window.on("closed", () => {
    callBacks?.onClose()
  })

  return window
}
