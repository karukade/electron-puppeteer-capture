import fs from "fs"
import path from "path"
import { app } from "electron"

const platform = process.platform

export const fsPromises = fs.promises

export const hasDirOrFile = async (dirOrFilePath: string) => {
  try {
    await fsPromises.access(dirOrFilePath, fs.constants.F_OK)
    return true
  } catch (e) {
    return false
  }
}
export const createFile = async (
  filePath: string,
  data: string | Buffer
): Promise<any> => {
  if (!(await hasDirOrFile(filePath))) {
    const fileDir = path.dirname(filePath)
    await fsPromises.mkdir(fileDir, { recursive: true })
  }
  return fsPromises.writeFile(filePath, data)
}

export const isDevelopment = process.env.NODE_ENV !== "production"
export const isWindows = platform === "win32"
export const isMacintosh = platform === "darwin"
export const userDataPath = isDevelopment
  ? path.resolve(__dirname, "../temp-user-data")
  : app.getPath("userData")
