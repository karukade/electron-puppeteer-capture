import { reducerWithInitialState } from "typescript-fsa-reducers"

import { setMessage } from "../actions/app"

export type AppStateType = {
  message: string
}

const initialState: AppStateType = {
  message: "initial",
}

export default reducerWithInitialState(initialState).case(
  setMessage,
  (state, message) => ({
    message,
  })
)
