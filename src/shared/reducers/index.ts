import { combineReducers } from "redux"

import chromium, { ChromiumStateType } from "./chromium"
import logics, { LogicStateType } from "./logics"
import urls, { UrlsType } from "./urls"

export type StateType = {
  chromium: ChromiumStateType
  logics: LogicStateType
  urls: UrlsType
}

export default combineReducers({
  chromium,
  logics,
  urls,
})
