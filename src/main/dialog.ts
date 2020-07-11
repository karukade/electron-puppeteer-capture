import { dialog } from "electron"

export const showFileSelectDialog = (ext = "excel") => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "custum", extensions: [ext] }],
  })
  if (canceled || filePaths.length === 0) return null
  return filePaths[0]
}
