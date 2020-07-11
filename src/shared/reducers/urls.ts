import { reducerWithInitialState } from "typescript-fsa-reducers"
import { setUrlList } from "../actions/urls"
import { UrlListType } from "../../main/services/excelParser"

export type UrlsType = {
  loading: boolean
  urls: UrlListType | null
  error: boolean
}

const initialState: UrlsType = {
  loading: false,
  urls: null,
  error: false,
}

export default reducerWithInitialState(initialState)
  .case(setUrlList.started, (state) => ({
    ...state,
    loading: true,
  }))
  .case(setUrlList.done, (state, urls) => ({
    loading: false,
    urls: urls.result,
    error: false,
  }))
  .case(setUrlList.failed, () => ({
    loading: false,
    urls: null,
    error: true,
  }))
