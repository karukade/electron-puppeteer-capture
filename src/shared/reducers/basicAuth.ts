import { reducerWithInitialState } from "typescript-fsa-reducers"
import {
  addBasicAuth,
  updateBasicAuth,
  removeBasicAuth,
  setBasicAuth,
} from "../actions/basicAuth"
import { AuthLists } from "../../main/services/basicAuth"

export type BasicAuthStateType = {
  authLists: AuthLists
}

const initialState: BasicAuthStateType = {
  authLists: [],
}

const createAuthId = () => new Date().getTime()

export default reducerWithInitialState(initialState)
  .case(setBasicAuth, (state, authLists) => ({
    ...state,
    authLists,
  }))
  .case(addBasicAuth, (state, info) => ({
    ...state,
    authLists: [...state.authLists, { ...info, id: createAuthId() }],
  }))
  .case(updateBasicAuth, (state, authInfo) => ({
    ...state,
    authLists: state.authLists.map((item) =>
      item.id === authInfo.id ? authInfo : item
    ),
  }))
  .case(removeBasicAuth, (state, id) => ({
    ...state,
    authLists: state.authLists.filter((item) => item.id !== id),
  }))
