import { reducerWithInitialState } from "typescript-fsa-reducers"
import { setLogics, removeLogic } from "../actions/logics"
import { LogicsType } from "../../main/services/logics"

export type LogicStateType = {
  logics: LogicsType | null
}

const initialState: LogicStateType = {
  logics: null,
}

export default reducerWithInitialState(initialState)
  .case(setLogics, (state, logics) => ({
    logics,
  }))
  .case(removeLogic, ({ logics }, logicInfo) => {
    if (!logics) return { logics }
    const newLogics = new Map(logics)
    newLogics.delete(logicInfo.name)
    return {
      logics: newLogics,
    }
  })
