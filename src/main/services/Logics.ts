import path from "path"
import * as utils from "../utils"

type LogicsValue = {
  value: string
  description?: string
}

type LogicInfo = LogicsValue & {
  name: string
}

export default class Logics {
  private logics!: Map<string, LogicsValue> | null
  readonly srcPath: string = path.join(utils.userDataPath, "logics.json")

  async init() {
    if (!(await utils.hasDirOrFile(this.srcPath))) {
      this.logics = null
      return this.logics
    }
    const logics = await utils.fsPromises.readFile(this.srcPath, {
      encoding: "utf-8",
    })
    this.logics = new Map(JSON.parse(logics))
    return this.logics
  }

  async setLogic({ name, ...rest }: LogicInfo) {
    if (!this.isValid({ name, ...rest })) return
    if (!this.logics) {
      this.logics = new Map()
    }
    this.logics.set(name, rest)
    await this.writeLogicFile()
  }

  async updateLogic({ name, ...rest }: LogicInfo, lastLogicName: string) {
    //ロジック名に変更がなければそのまま上書き
    if (this.logics?.has(name)) {
      this.logics?.set(name, rest)
    } else {
      //ロジック名が変更されていたら同じlastLogicNameの位置にセットする
      const logics = new Map()
      this.logics?.forEach((info, _name) => {
        if (_name === lastLogicName) {
          logics.set(name, rest)
        } else {
          logics.set(_name, info)
        }
      })
      this.logics = logics
    }
    await this.writeLogicFile()
  }

  async importLogic(importedFilePath: string) {
    const data = await utils.fsPromises.readFile(importedFilePath, {
      encoding: "utf-8",
    })
    try {
      const parsed = JSON.parse(data)
      this.logics = new Map(parsed)
      return this.logics
    } catch (e) {
      // SyntaxError = JSON.parse Err / TypeError = Map Err
      if (e.name === "SyntaxError" || e.name === "TypeError") {
        return Promise.reject(e.name)
      }
      throw e
    }
  }

  private isValid(info: LogicInfo) {
    return info.name !== "" && info.value !== ""
  }

  private async writeLogicFile() {
    if (!this.logics) return
    await utils.fsPromises.writeFile(
      this.srcPath,
      JSON.stringify([...this.logics])
    )
  }

  get getLogics() {
    return this.logics
  }
}
