import { Store } from "redux"

import { getInitializeData } from "../services/appInitializer"

// actions
import {
  setChromiumExecutablePath,
  setChromiumInitialized,
} from "../../shared/actions/chromium"
import { setLogics } from "../../shared/actions/logics"
import { setDevices, setPresets } from "../../shared/actions/devices"

export const initData = async (store: Store) => {
  const {
    chromiumExecutablePath,
    logics,
    devices,
    devicePresets,
  } = await getInitializeData()

  store.dispatch(setChromiumInitialized(true))
  store.dispatch(setChromiumExecutablePath(chromiumExecutablePath))
  store.dispatch(setLogics(logics))
  store.dispatch(setDevices(devices))
  store.dispatch(setPresets(devicePresets))
}
