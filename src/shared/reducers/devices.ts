import { reducerWithInitialState } from "typescript-fsa-reducers"
import {
  addDevice,
  updateDevice,
  setDevices,
  setPresets,
} from "../actions/devices"
import { DeviceListsType } from "../../main/services/devices"

export type DeviceStateType = {
  presets: DeviceListsType
} & DeviceListsType

const initialState: DeviceStateType = {
  presets: {
    pc: [],
    sp: [],
    tablet: [],
  },
  pc: [],
  sp: [],
  tablet: [],
}

export default reducerWithInitialState(initialState)
  .case(addDevice, (state, deviceInfo) => ({
    ...state,
    [deviceInfo.type]: [...state[deviceInfo.type], deviceInfo],
  }))
  .case(updateDevice, (state, deviceInfo) => ({
    ...state,
    [deviceInfo.type]: state[deviceInfo.type].map((device) =>
      device.name === deviceInfo.name ? deviceInfo : device
    ),
  }))
  .case(setDevices, (state, deviceLists) => ({
    ...state,
    ...deviceLists,
  }))
  .case(setPresets, (state, deviceLists) => ({
    ...state,
    presets: deviceLists,
  }))
