import { combineReducers } from "redux"

import chromium, { ChromiumStateType } from "./chromium"
import logics, { LogicStateType } from "./logics"

export type StateType = {
  chromium: ChromiumStateType
  logics: LogicStateType
}

export default combineReducers({
  chromium,
  logics,
})
