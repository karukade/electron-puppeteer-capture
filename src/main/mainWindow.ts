import { EventEmitter } from "events"
import { BrowserWindow, BrowserWindowConstructorOptions } from "electron"
import path from "path"
import { format as formatUrl } from "url"

import * as utils from "./utils"

type BrowserWindowType = typeof BrowserWindow
export type MainWindowCallBacks = {
  onClose: () => void
}

const browserWindowOptions: BrowserWindowConstructorOptions = {
  show: false,
  width: 1180,
  height: 700,
  webPreferences: {
    preload: path.resolve(__dirname, "./preload.js"),
  },
}

export default class MainWindow extends EventEmitter {
  private window!: BrowserWindow | null

  get win() {
    return this.window
  }

  public createWindow() {
    this.window = new BrowserWindow(browserWindowOptions)

    this.loadUrl()

    this.window.once("ready-to-show", () => {
      this.window?.show()
      this.emit("ready-to-show")
      if (utils.isDevelopment) {
        this.window?.webContents.openDevTools()
      }
    })

    this.window.on("closed", () => (this.window = null))
  }

  private loadUrl() {
    if (utils.isDevelopment) {
      this.window?.loadURL(`http://localhost:${process.env.DEV_SERVER_PORT}`)
    } else {
      this.window?.loadURL(
        formatUrl({
          pathname: path.resolve(__dirname, "../renderer/index.html"),
          protocol: "file",
          slashes: true,
        })
      )
    }
  }
}
