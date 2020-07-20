import { Store } from "redux"

import { parseList } from "../services/urlListParser"
import { showFileSelectDialog } from "../dialog"
import { errCodes } from "../errHandler"

// store action
import { setUrlList } from "../../shared/actions/urls"

export const readUrlList = async (store: Store) => {
  const filePath = await showFileSelectDialog()
  if (!filePath) return
  store.dispatch(setUrlList.started(filePath))
  try {
    const urlList = await parseList(filePath)
    store.dispatch(setUrlList.done({ params: filePath, result: urlList }))
  } catch (e) {
    if (e.message === errCodes.INVALID_EXCEL)
      return store.dispatch(
        setUrlList.failed({ params: filePath, error: true })
      )
    throw e
  }
}
