import fs from "fs"
import path from "path"
import { app } from "electron"

const fsPromises = fs.promises

const hasDirOrFile = async (dirOrFilePath: string) => {
  try {
    await fsPromises.access(dirOrFilePath, fs.constants.F_OK)
    return true
  } catch (e) {
    return false
  }
}
const createFile = async (
  dirOrFilePath: string,
  data: string | Buffer
): Promise<any> => {
  if (!(await hasDirOrFile(dirOrFilePath))) {
    const filePath = path.dirname(dirOrFilePath)
    await fsPromises.mkdir(filePath, { recursive: true })
  }
  return fsPromises.writeFile(dirOrFilePath, data)
}

const isDevelopment = process.env.NODE_ENV !== "production"
const platform = process.platform
const isWindows = platform === "win32"
const isMacintosh = platform === "darwin"
const userDataPath = isDevelopment
  ? path.resolve(__dirname, "../devUserData")
  : app.getPath("userData")

export default {
  isWindows,
  isMacintosh,
  isDevelopment,
  userDataPath,
  hasDirOrFile,
  createFile,
}
