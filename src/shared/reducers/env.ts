import { reducerWithInitialState } from "typescript-fsa-reducers"
import { setPlatForm } from "../actions/env"

export type EnvStateType = {
  platform: NodeJS.Platform | null
}

const initialState: EnvStateType = {
  platform: null,
}

export default reducerWithInitialState(initialState).case(
  setPlatForm,
  (state, platform) => ({
    ...state,
    platform,
  })
)
