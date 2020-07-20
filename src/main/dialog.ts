import { dialog } from "electron"

export const showFileSelectDialog = async (ext = "xlsx") => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "custum", extensions: [ext] }],
  })
  if (canceled || filePaths.length === 0) return null
  return filePaths[0]
}

export const showDirSelectDialog = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory", "createDirectory"],
  })
  if (canceled || filePaths.length === 0) return null
  return filePaths[0]
}
