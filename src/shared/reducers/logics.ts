import { reducerWithInitialState } from "typescript-fsa-reducers"
import { setLogics } from "../actions/logics"
import { LogicsType } from "../../main/services/logics"

export type LogicStateType = {
  logics: LogicsType | null
}

const initialState: LogicStateType = {
  logics: null,
}

export default reducerWithInitialState(initialState).case(
  setLogics,
  (state, logics) => ({
    logics,
  })
)
