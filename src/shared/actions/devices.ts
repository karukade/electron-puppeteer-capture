import actionCreatorFactory from "typescript-fsa"
import { DeviceInfoType, DeviceListsType } from "../../main/services/devices"

const actionCreator = actionCreatorFactory()

export const addDevice = actionCreator<DeviceInfoType>("ADD_DEVICE")
export const updateDevice = actionCreator<DeviceInfoType>("UPDATE_DEVICE")
export const setDevices = actionCreator<DeviceListsType>("SET_DEVICES_DEVICES")
export const setPresets = actionCreator<DeviceListsType>("SET_PRESETS")
