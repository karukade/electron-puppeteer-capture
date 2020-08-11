import { reducerWithInitialState } from "typescript-fsa-reducers"
import { setSelected, setPresets, addPresets } from "../actions/devices"
import { DeviceListsType, DeviceNamesType } from "../../main/services/devices"

export type DeviceStateType = {
  presets: DeviceListsType
  selected: DeviceNamesType
}

const initialState: DeviceStateType = {
  presets: {
    pc: [],
    sp: [],
    tablet: [],
  },
  selected: {
    pc: [],
    sp: [],
    tablet: [],
  },
}

export default reducerWithInitialState(initialState)
  .case(setSelected, (state, selected) => ({
    ...state,
    selected,
  }))
  .case(setPresets, (state, deviceLists) => ({
    ...state,
    presets: deviceLists,
  }))
  .case(addPresets, (state, deviceInfo) => ({
    ...state,
    presets: {
      ...state.presets,
      [deviceInfo.type]: [...state.presets[deviceInfo.type], deviceInfo],
    },
  }))
