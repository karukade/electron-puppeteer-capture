import actionCreatorFactory from "typescript-fsa"

const actionCreator = actionCreatorFactory()

export const setPlatForm = actionCreator<NodeJS.Platform>("SET_PLATFORM")
