import React from "react"
import { useSelector } from "react-redux"
import { readUrlsExcel, setCaptureSavePath, startCapture } from "../ipcHandler"

import UrlList from "./UrlList"

import { StateType } from "../../shared/reducers"

const Capture: React.FC = () => {
  const captureSavePath = useSelector(
    (state: StateType) => state.chromium.captureSavePath
  )
  const urlListPath = useSelector((state: StateType) => state.urls.path)
  const urlList = useSelector((state: StateType) => state.urls.urls)

  const onClickReadCaptureSavePath = () => {
    setCaptureSavePath()
  }
  const onClickReadUrlList = () => {
    readUrlsExcel()
  }
  const onClickStartCapture = () => startCapture()
  return (
    <div>
      <section>
        <h3>URLリストを選択</h3>
        {urlListPath}
        <button onClick={onClickReadUrlList}>URLリストを選択</button>
      </section>
      <section>
        <h3>画像保存先を選択</h3>
        {captureSavePath}
        <button onClick={onClickReadCaptureSavePath}>画像保存先を選択</button>
      </section>
      <button onClick={onClickStartCapture}>キャプチャ開始</button>
      {urlList instanceof Map && <UrlList list={urlList} />}
    </div>
  )
}

export default Capture
