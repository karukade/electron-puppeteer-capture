import { Store } from "redux"

// service
import { getInitializeData } from "../services/appInitializer"

// actions
import {
  setChromiumExecutablePath,
  setChromiumInitialized,
} from "../../shared/actions/capture"
import { setLogics } from "../../shared/actions/logics"
import { setSelected, setPresets } from "../../shared/actions/devices"
import { setBasicAuth } from "../../shared/actions/basicAuth"

export const initData = async (store: Store) => {
  const {
    chromiumExecutablePath,
    logics,
    devices,
    devicePresets,
    basicAuth,
  } = await getInitializeData()

  store.dispatch(setChromiumInitialized(true))
  store.dispatch(setChromiumExecutablePath(chromiumExecutablePath))
  store.dispatch(setLogics(logics))
  store.dispatch(setSelected(devices))
  store.dispatch(setPresets(devicePresets))
  basicAuth && store.dispatch(setBasicAuth(basicAuth))
}
