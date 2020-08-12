import path from "path"
import { Store } from "redux"
import extract from "extract-zip"
import { shell } from "electron"

import { showDirSelectDialog } from "../dialog"
import { parseList } from "../services/urlListParser"
import { showFileSelectDialog } from "../dialog"
import * as utils from "../utils"
import { errCodes } from "../errHandler"

// store action
import { setUrlList } from "../../shared/actions/urls"

const LIST_NAME = "urls.zip"

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

const getUrlListArchivePath = () => {
  return utils.isTest || utils.isDevelopment
    ? path.resolve(__dirname, `../../resources/${LIST_NAME}`)
    : path.resolve(__dirname, `../${LIST_NAME}`)
}

export const downloadUrlList = async () => {
  const downloadPath = await showDirSelectDialog({
    title: "ダウンロード先を選択してください",
    defaultPath: utils.defaultDownloadDir,
  })
  if (!downloadPath) return

  const listPath = getUrlListArchivePath()

  await extract(listPath, { dir: downloadPath })
  shell.showItemInFolder(path.join(downloadPath, `urls.xlsx`))
}
