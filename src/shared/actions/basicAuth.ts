import actionCreatorFactory from "typescript-fsa"
import { AuthInfo, AuthLists } from "../../main/services/basicAuth"

const actionCreator = actionCreatorFactory()

export const setBasicAuth = actionCreator<AuthLists>("SET_BASIC_AUTH")
export const addBasicAuth = actionCreator<Omit<AuthInfo, "id">>(
  "ADD_BASIC_AUTH"
)
export const updateBasicAuth = actionCreator<AuthInfo>("UPDATE_BASIC_AUTH")
export const removeBasicAuth = actionCreator<number>("REMOVE_BASIC_AUTH")
