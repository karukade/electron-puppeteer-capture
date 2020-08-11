import path from "path"
import * as utils from "../utils"
import { errCodes } from "../errHandler"
import { AuthOptions } from "puppeteer"

export type AuthInfo = {
  id: number
  host: string
} & AuthOptions

export type AuthLists = AuthInfo[]

export type AuthInfoDomainMap = Map<string, AuthInfo>

const authFilePath = path.join(utils.userDataDir, "auth.json")

export const readAuthFromFile = async () => {
  if (!(await utils.hasDirOrFile(authFilePath))) return null
  const auth = await utils.fsPromises.readFile(authFilePath, {
    encoding: "utf-8",
  })
  return JSON.parse(auth) as AuthLists
}

export const writeAuthFile = async (auth: AuthLists) => {
  await utils.fsPromises.writeFile(authFilePath, JSON.stringify(auth))
}
