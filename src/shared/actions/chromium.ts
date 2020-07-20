import actionCreatorFactory from "typescript-fsa"

const actionCreator = actionCreatorFactory()

export const setChromiumInitialized = actionCreator<boolean>(
  "SET_CHROMIUM_INITIALIZED"
)
export const setChromiumExecutablePath = actionCreator<string>(
  "SET_CHROMIUM_EXECUTABLE_PATH"
)
export const setCaptureSavePath = actionCreator<string>("SET_CAPTURE_SAVE_PATH")
