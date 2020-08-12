import fs from "fs"
import path from "path"
import { app } from "electron"
import { argv } from "yargs"

type Argv = {
  userData?: string
}

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
export const createFileOrDir = async (
  filePath: string,
  data?: string | Buffer
): Promise<any> => {
  if (!(await hasDirOrFile(filePath))) {
    const fileDir =
      path.extname(filePath) !== "" ? path.dirname(filePath) : filePath
    await fsPromises.mkdir(fileDir, { recursive: true })
  }
  if (!data) return
  return fsPromises.writeFile(filePath, data)
}

export const isDevelopment = process.env.NODE_ENV === "development"
export const isTest = process.env.NODE_ENV === "test"
export const isWindows = platform === "win32"
export const isMacintosh = platform === "darwin"
export const userDataDir = isDevelopment
  ? path.resolve(__dirname, "../../dev-user-data")
  : isTest
  ? path.resolve(__dirname, "../../test-user-data")
  : (argv as Argv).userData || app.getPath("userData")

export const defaultDownloadDir = app.getPath("downloads")
