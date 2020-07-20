import { Store } from "redux"
import { StateType } from "../reducers/"

type StoreType = Store<StateType>

export const getUnfinishedUrl = (store: StoreType) => {
  const {
    urls: { urls },
  } = store.getState()
  if (!urls) return urls
  return new Map([...urls].filter(([, info]) => !info.done && !info.invalidUrl))
}

export const getDevices = (store: StoreType) => {
  return store.getState().devices
}

export const getCaptureSavePath = (store: StoreType) => {
  return store.getState().chromium.captureSavePath
}

export const getExecutablePath = (store: StoreType) => {
  return store.getState().chromium.executablePath
}

export const getCaptureData = (store: StoreType) => {
  const urlList = getUnfinishedUrl(store)
  const devices = getDevices(store)
  const captureSavePath = getCaptureSavePath(store)
  const executablePath = getExecutablePath(store)
  return {
    urlList,
    devices,
    captureSavePath,
    executablePath,
  }
}
