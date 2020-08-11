import { reducerWithInitialState } from "typescript-fsa-reducers"
import {
  setChromiumExecutablePath,
  setChromiumInitialized,
  setCaptureSavePath,
  setCaptureState,
} from "../actions/capture"

export type CaptureStateType = {
  initialized: boolean
  executablePath: string | null
  captureSavePath: string | null
  captureState: "idle" | "progress" | "stopping" | "stop" | "done"
}

const initialState: CaptureStateType = {
  initialized: false,
  executablePath: null,
  captureSavePath: null,
  captureState: "idle",
}

export default reducerWithInitialState(initialState)
  .case(setChromiumExecutablePath, (state, executablePath) => ({
    ...state,
    executablePath,
  }))
  .case(setChromiumInitialized, (state, initialized) => ({
    ...state,
    initialized,
  }))
  .case(setCaptureSavePath, (state, captureSavePath) => ({
    ...state,
    captureSavePath,
  }))
  .case(setCaptureState, (state, captureState) => ({
    ...state,
    captureState,
  }))
