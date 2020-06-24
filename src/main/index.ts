"use strict"

import { app } from "electron"

import utils from "./utils"
import MainWindow from "./MainWindow"

const mainWindow = new MainWindow()

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow.win === null) {
    mainWindow.createWindow()
  }
})

const installExtensions = async () => {
  const installer = require("electron-devtools-installer")
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"]

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log)
}

// create main BrowserWindow when electron is ready
app.on("ready", async () => {
  if (utils.isDevelopment) await installExtensions()
  mainWindow.createWindow()
})
