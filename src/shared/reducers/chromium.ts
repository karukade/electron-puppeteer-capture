import { reducerWithInitialState } from "typescript-fsa-reducers"
import {
  setChromiumExecutablePath,
  setChromiumInitialized,
  setCaptureSavePath,
} from "../actions/chromium"

export type ChromiumStateType = {
  initialized: boolean
  executablePath: string | null
  captureSavePath: string | null
}

const initialState: ChromiumStateType = {
  initialized: false,
  executablePath: null,
  captureSavePath: null,
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
