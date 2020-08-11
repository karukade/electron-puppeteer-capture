import createActionCreator from "typescript-fsa"

import {
  UrlListType,
  CaptureTargetInfo,
} from "../../main/services/urlListParser"

type UpdatableProps = Pick<CaptureTargetInfo, "index"> &
  Partial<Pick<CaptureTargetInfo, "done" | "status" | "capturing" | "title">>

const actionCreator = createActionCreator()

export const setUrlList = actionCreator.async<string, UrlListType, boolean>(
  "SET_URL_LIST"
)

export const resetUrlList = actionCreator<void>("RESET_URL_LIST")

export const upDateUrlList = actionCreator<UpdatableProps>("UPDATE_URL_LIST")
