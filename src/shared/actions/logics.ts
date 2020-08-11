import actionCreatorFactory from "typescript-fsa"
import { LogicsType, LogicInfo } from "../../main/services/logics"
const actionCreator = actionCreatorFactory()

export const setLogics = actionCreator<LogicsType | null>("SET_LOGICS")
export const removeLogic = actionCreator<LogicInfo>("REMOVE_LOGIC")
