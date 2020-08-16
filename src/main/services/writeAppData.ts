import { Store } from "redux"
import { writeLogicFile } from "./logics"
import { writeDeviceFile } from "./devices"
import { writeAuthFile } from "./basicAuth"

import { StateType } from "../../shared/reducers"

export const writeAppDataToFile = async (store: Store<StateType>) => {
  const { logics, devices, basicAuth } = store.getState()
  return Promise.all([
    logics.logics && writeLogicFile(logics.logics),
    basicAuth.authLists && writeAuthFile(basicAuth.authLists),
    writeDeviceFile({
      devices: devices.selected,
      presets: devices.presets,
    }),
  ])
}
