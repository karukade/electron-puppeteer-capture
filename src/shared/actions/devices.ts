import actionCreatorFactory from "typescript-fsa"
import {
  DeviceInfoType,
  DeviceListsType,
  DeviceNamesType,
} from "../../main/services/devices"

const actionCreator = actionCreatorFactory()

export const setSelected = actionCreator<DeviceNamesType>("SET_DEVICES_DEVICES")
export const setPresets = actionCreator<DeviceListsType>("SET_PRESETS")
export const addPresets = actionCreator<DeviceInfoType>("ADD_PRESETS")
