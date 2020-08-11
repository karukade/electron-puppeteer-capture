import { combineReducers } from "redux"

import capture, { CaptureStateType } from "./capture"
import logics, { LogicStateType } from "./logics"
import urls, { UrlsType } from "./urls"
import devices, { DeviceStateType } from "./devices"
import env, { EnvStateType } from "./env"
import rendererEditor, { RendererEditorStateType } from "./rendererEditor"
import basicAuth, { BasicAuthStateType } from "./basicAuth"

export type StateType = {
  capture: CaptureStateType
  logics: LogicStateType
  urls: UrlsType
  devices: DeviceStateType
  env: EnvStateType
  rendererEditor: RendererEditorStateType
  basicAuth: BasicAuthStateType
}

export default combineReducers({
  capture,
  logics,
  urls,
  devices,
  env,
  rendererEditor,
  basicAuth,
})
