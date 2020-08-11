import { reducerWithInitialState } from "typescript-fsa-reducers"
import { setUrlList, upDateUrlList, resetUrlList } from "../actions/urls"
import { UrlListType } from "../../main/services/urlListParser"

export type UrlsType = {
  path: string | null
  loading: boolean
  urls: UrlListType | null
  error: boolean
}

const initialState: UrlsType = {
  path: null,
  loading: false,
  urls: null,
  error: false,
}

export default reducerWithInitialState(initialState)
  .case(setUrlList.started, (state, path) => ({
    ...state,
    path,
    loading: true,
  }))
  .case(setUrlList.done, (state, urls) => ({
    ...state,
    loading: false,
    urls: urls.result,
    error: false,
  }))
  .case(setUrlList.failed, (state) => ({
    ...state,
    loading: false,
    urls: null,
    error: true,
  }))
  .case(upDateUrlList, (state, captureTargetInfo) => {
    if (!state.urls) return state
    const current = state.urls.get(captureTargetInfo.index)
    const merged = Object.assign({}, current, captureTargetInfo)
    const updated = new Map(state.urls.set(captureTargetInfo.index, merged))

    return {
      ...state,
      urls: updated,
    }
  })
  .case(resetUrlList, () => ({
    ...initialState,
  }))
