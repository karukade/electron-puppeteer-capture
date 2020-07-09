import path from "path"
import * as utils from "../utils"
import { errCodes } from "../errHandler"

type LogicsValue = {
  value: string
  description?: string
}

type LogicInfo = LogicsValue & {
  name: string
}

const logicFilePath = path.join(utils.userDataDir, "logics.json")

export type LogicsType = Map<string, LogicsValue>

export const isValidLogic = (info: LogicInfo) => {
  return info.name !== "" && info.value !== ""
}

export const mergeNewLogic = (
  { name, ...rest }: LogicInfo,
  logics: LogicsType
) => {
  if (isValidLogic({ name, ...rest })) return null
  return new Map(logics).set(name, rest)
}

export const readLogicsFromFile = async () => {
  if (!(await utils.hasDirOrFile(logicFilePath))) return null
  const logics = await utils.fsPromises.readFile(logicFilePath, {
    encoding: "utf-8",
  })
  return new Map(JSON.parse(logics)) as LogicsType
}

export const writeLogicFile = async (logics: LogicsType) => {
  await utils.fsPromises.writeFile(logicFilePath, JSON.stringify([...logics]))
}

export const updateLogic = async (
  { name, ...rest }: LogicInfo,
  lastLogicName: string,
  logics: LogicsType
) => {
  //ロジック名に変更がなければそのまま上書き
  if (logics.has(name)) {
    return new Map(logics).set(name, rest)
  } else {
    //ロジック名が変更されていたら同じlastLogicNameの位置にセットする
    const newLogics = new Map()
    logics.forEach((info, _name) => {
      if (_name === lastLogicName) {
        newLogics.set(name, rest)
      } else {
        newLogics.set(_name, info)
      }
    })
    return newLogics
  }
}

export const importLogic = async (importedFilePath: string) => {
  const data = await utils.fsPromises.readFile(importedFilePath, {
    encoding: "utf-8",
  })
  try {
    const parsed = JSON.parse(data)
    return new Map(parsed)
  } catch (e) {
    // SyntaxError = JSON.parse Err / TypeError = Map Err
    if (e.name === "SyntaxError" || e.name === "TypeError") {
      throw new Error(errCodes.INVALID_LOGIC_FILE)
    }
    throw e
  }
}
