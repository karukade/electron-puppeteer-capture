"use strict"

import { app } from "electron"
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer"

import utils from "./utils"
import MainWindow from "./MainWindow"

const mainWindow = new MainWindow()

// global reference to mainWindow (necessary to prevent window from being garbage collected)

// function addIpcSubscriber() {
//   ipcMain.handle("test", async (event, data: string) => {})
// }

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

// create main BrowserWindow when electron is ready
app.on("ready", () => mainWindow.createWindow())

// add react devtools
if (utils.isDevelopment) {
  app.whenReady().then(() => {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err))
  })
}
