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
    preload: path.resolve(__dirname, "./preload.js"),
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
    window.loadURL(`http://localhost:${process.env.WEBPACK_DEV_PORT}`)
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.resolve("../renderer/index.html"),
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

export default class MainWindow {
  private window!: BrowserWindow | null

  get win() {
    return this.window
  }

  public createWindow() {
    this.window = new BrowserWindow(browserWindowOptions)

    if (utils.isDevelopment) {
      this.window.webContents.openDevTools()
    }

    if (utils.isDevelopment) {
      this.window.loadURL(`http://localhost:8081`)
    } else {
      this.window.loadURL(
        formatUrl({
          pathname: path.resolve(__dirname, "../renderer/index.html"),
          protocol: "file",
          slashes: true,
        })
      )
    }

    this.window.on("closed", () => (this.window = null))
  }
}
