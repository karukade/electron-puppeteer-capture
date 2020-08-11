import path from "path"
import * as utils from "../utils"
import { errCodes } from "../errHandler"

export type LogicInfo = {
  name: string
  value: string
  description?: string
}

export type UpdateLogicArg = {
  logic: LogicInfo
  logics: LogicsType
  lastLogicName?: string
}

const logicFilePath = path.join(utils.userDataDir, "logics.json")

export type LogicsType = Map<string, LogicInfo>

export const mergeNewLogic = (
  { name, ...rest }: LogicInfo,
  logics: LogicsType | null
) => {
  return new Map(logics || []).set(name, { name, ...rest })
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

export const updateLogic = ({
  logic: { name, ...rest },
  logics,
  lastLogicName,
}: UpdateLogicArg) => {
  //ロジック名に変更がなければそのまま上書き
  if (logics.has(name)) return new Map(logics).set(name, { name, ...rest })
  if (!lastLogicName) return logics
  //ロジック名が変更されていたら同じlastLogicNameの位置にセットする
  const newLogics = new Map()
  logics.forEach((info, _name) => {
    if (_name === lastLogicName) {
      newLogics.set(name, { name, ...rest })
    } else {
      newLogics.set(_name, info)
    }
  })
  return newLogics
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
