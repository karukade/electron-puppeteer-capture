import { Store } from "redux"

// service
import {
  LogicsType,
  LogicInfo,
  mergeNewLogic,
  updateLogic as serviceUpdateLogic,
  UpdateLogicArg,
} from "../services/logics"

// store action
import { setLogics as actionSetLogics } from "../../shared/actions/logics"

export const updateLogics = async (
  store: Store,
  logic: UpdateLogicArg["logic"],
  lastLogicName: UpdateLogicArg["lastLogicName"]
) => {
  const logics = store.getState().logics.logics as LogicsType
  const newLogics = serviceUpdateLogic({
    logic,
    lastLogicName,
    logics,
  })
  store.dispatch(actionSetLogics(newLogics))
}

export const setLogics = (store: Store, logic: LogicInfo) => {
  const { logics } = store.getState().logics
  const newLogic = mergeNewLogic(logic, logics)
  store.dispatch(actionSetLogics(newLogic))
}
