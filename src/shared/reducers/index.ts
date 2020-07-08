import { combineReducers } from "redux"

import chromium, { ChromiumStateType } from "./chromium"

export type StateType = {
  chromium: ChromiumStateType
}

export default combineReducers({
  chromium,
})
