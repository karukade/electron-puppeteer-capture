import { reducerWithInitialState } from "typescript-fsa-reducers"
import {
  setChromiumExecutablePath,
  setChromiumInitialized,
} from "../actions/chromium"

export type ChromiumStateType = {
  initialized: boolean
  executablePath: string | null
}

const initialState: ChromiumStateType = {
  initialized: false,
  executablePath: null,
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
