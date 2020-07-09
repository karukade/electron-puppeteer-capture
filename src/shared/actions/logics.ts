import actionCreatorFactory from "typescript-fsa"
import { LogicsType } from "../../main/services/logics"
const actionCreator = actionCreatorFactory()

export const setLogics = actionCreator<LogicsType | null>("SET_LOGICS")
