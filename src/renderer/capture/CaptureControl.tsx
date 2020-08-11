import React, { useCallback } from "react"
import { useSelector } from "react-redux"
import { Form, Checkbox } from "antd"

//ipc
import { readUrlsExcel, setCaptureSavePath } from "../ipcHandler"

// Components
import FileSelect from "../common/FileSelect"
import CaptureButton from "./CaptureButton"

//types
import { StateType } from "../../shared/reducers"

//store action
import { setCaptureSavePath as actionSetCaptureSavePath } from "../../shared/actions/capture"

const Capture: React.FC = () => {
  const captureSavePath = useSelector(
    (state: StateType) => state.capture.captureSavePath
  )
  const urlListPath = useSelector((state: StateType) => state.urls.path)

  const onClickReadCaptureSavePath = useCallback(() => {
    setCaptureSavePath()
  }, [])

  const onClickReadUrlList = useCallback(() => {
    readUrlsExcel()
  }, [])

  const onChange = (e: any) => {
    setCaptureSavePath(e.target.checked)
  }

  return (
    <Form layout="vertical">
      <Form.Item label={"URLリストを選択"}>
        <FileSelect onClick={onClickReadUrlList}>{urlListPath}</FileSelect>
      </Form.Item>
      <Form.Item label={"画像保存先を選択"}>
        <FileSelect onClick={onClickReadCaptureSavePath}>
          {captureSavePath}
        </FileSelect>
        <Checkbox disabled={urlListPath ? false : true} onChange={onChange}>
          URLリストと同じパスに保存する
        </Checkbox>
      </Form.Item>
      <CaptureButton />
    </Form>
  )
}

export default Capture
