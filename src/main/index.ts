"use strict"

import { app, BrowserWindow } from "electron"
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer"

import { createMainWindow, MainWindowCallBacks } from "./mainWindow"
import utils from "./utils"

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow!: BrowserWindow | null

// function addIpcSubscriber() {
//   ipcMain.handle("test", async (event, data: string) => {})
// }

const onWindowClose = () => {
  mainWindow = null
}

const mainWindowEventHandlers: MainWindowCallBacks = {
  onClose: onWindowClose,
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  // if (mainWindow === null) {
  //   mainWindow = createMainWindow(BrowserWindow, mainWindowEventHandlers)
  // }
})

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  mainWindow = createMainWindow(BrowserWindow, mainWindowEventHandlers)
})

// add react devtools
if (utils.isDevelopment) {
  app.whenReady().then(() => {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err))
  })
}
