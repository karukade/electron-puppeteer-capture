import createActionCreator from "typescript-fsa"

import { UrlListType } from "../../main/services/excelParser"

const actionCreator = createActionCreator()

export const setUrlList = actionCreator.async<void, UrlListType, boolean>(
  "SET_URL_LIST"
)
