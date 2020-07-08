import actionCreatorFactory from "typescript-fsa"

const actionCreator = actionCreatorFactory()

export const setMessage = actionCreator<string>("SET_MESSAGE")
