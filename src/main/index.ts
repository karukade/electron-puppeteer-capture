"use strict"
import { app } from "electron"

import * as utils from "./utils"
import MainWindow from "./MainWindow"
import { addIpcHandlers } from "./ipc"
import { addErrorHandler } from "./errHandler"
import configureStore from "../shared/store/configureStore"
import { writeAppDataToFile } from "./services/writeAppData"

// store actions
import { setPlatForm } from "../shared/actions/env"

const mainWindow = new MainWindow()
const store = configureStore()

if (utils.isDevelopment) {
  require("source-map-support").install()
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  writeAppDataToFile(store)
  if (process.platform !== "darwin") app.quit()
})

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow.win === null) mainWindow.createWindow()
})

// create main BrowserWindow when electron is ready
app.on("ready", async () => {
  if (utils.isDevelopment) {
    const installExtensions = async () => {
      const installer = require("electron-devtools-installer")
      const forceDownload = !!process.env.UPGRADE_EXTENSIONS
      const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"]
      return Promise.all(
        extensions.map((name) =>
          installer.default(installer[name], forceDownload)
        )
      ).catch(() => null)
    }
    await installExtensions()
  }
  store.dispatch(setPlatForm(process.platform))
  mainWindow.createWindow()
})

// IpcMain.handler 初期化
addIpcHandlers(store)

// エラーハンドラ 初期化
addErrorHandler()
