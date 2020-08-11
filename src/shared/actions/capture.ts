import actionCreatorFactory from "typescript-fsa"
import { CaptureStateType } from "../reducers/capture"

const actionCreator = actionCreatorFactory()

export const setChromiumInitialized = actionCreator<
  CaptureStateType["initialized"]
>("SET_CHROMIUM_INITIALIZED")

export const setChromiumExecutablePath = actionCreator<
  CaptureStateType["executablePath"]
>("SET_CHROMIUM_EXECUTABLE_PATH")

export const setCaptureSavePath = actionCreator<
  CaptureStateType["captureSavePath"]
>("SET_CAPTURE_SAVE_PATH")

export const setCaptureState = actionCreator<CaptureStateType["captureState"]>(
  "SET_CAPTURE_STATE"
)
