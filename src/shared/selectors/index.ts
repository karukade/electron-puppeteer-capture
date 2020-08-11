import { createSelector } from "reselect"

import { StateType } from "../reducers/"

//types
import {
  DeviceListsType,
  DeviceType,
  DeviceInfoType,
} from "../../main/services/devices"
import { AuthInfoDomainMap } from "../../main/services/basicAuth"

const urlsSelector = (store: StateType) => store.urls.urls

export const getUnfinishedUrl = createSelector(
  urlsSelector,
  (urls) =>
    urls &&
    new Map([...urls].filter(([, info]) => !info.done && !info.invalidUrl))
)

export const getUrlListArray = createSelector(
  urlsSelector,
  (urlsMap) => urlsMap && [...urlsMap].map(([, value]) => value)
)

const presetsSelector = (store: StateType) => store.devices.presets
const selectedSelector = (store: StateType) => store.devices.selected

export const getDevices = createSelector(
  presetsSelector,
  selectedSelector,
  (presets, selected) => {
    return Object.entries(selected).reduce(
      (result, [deviceType, deviceNames]) => {
        result[deviceType as DeviceType] = (deviceNames as string[]).map(
          (deviceName) =>
            presets[deviceType as DeviceType].find(
              (device) => device.name === deviceName
            ) as DeviceInfoType
        )
        return result
      },
      {} as DeviceListsType
    )
  }
)

export const getCaptureSavePath = (store: StateType) => {
  return store.capture.captureSavePath
}

export const getExecutablePath = (store: StateType) => {
  return store.capture.executablePath
}

export const getLogics = (store: StateType) => store.logics.logics

export const basicAuthListsToMap = createSelector(
  (state: StateType) => state.basicAuth.authLists,
  (authLists) =>
    authLists.reduce((map, authInfo) => {
      map.set(authInfo.host, authInfo)
      return map
    }, new Map() as AuthInfoDomainMap)
)

export const basicAuthListsKeys = createSelector(basicAuthListsToMap, (map) => [
  ...map.keys(),
])

export const getCaptureData = (store: StateType) => {
  const urlList = getUnfinishedUrl(store)
  const deviceList = getDevices(store)
  const captureSavePath = getCaptureSavePath(store)
  const executablePath = getExecutablePath(store)
  const logics = getLogics(store)
  const basicAuthLists = basicAuthListsToMap(store)
  return {
    urlList,
    deviceList,
    captureSavePath,
    executablePath,
    logics,
    basicAuthLists,
  }
}

export const getInitializeData = (store: StateType) => {
  const devices = getDevices(store)
  const executablePath = getExecutablePath(store)
  const logics = getLogics(store)
  const basicAuth = store.basicAuth.authLists
  const devicePresets = store.devices.presets

  return {
    devices,
    executablePath,
    logics,
    devicePresets,
    basicAuth,
  }
}
