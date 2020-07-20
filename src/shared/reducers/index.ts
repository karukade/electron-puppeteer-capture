import { combineReducers } from "redux"

import chromium, { ChromiumStateType } from "./chromium"
import logics, { LogicStateType } from "./logics"
import urls, { UrlsType } from "./urls"
import devices, { DeviceStateType } from "./devices"

export type StateType = {
  chromium: ChromiumStateType
  logics: LogicStateType
  urls: UrlsType
  devices: DeviceStateType
}

export default combineReducers({
  chromium,
  logics,
  urls,
  devices,
})
