import React from "react"
import { useSelector } from "react-redux"
import { Button, Space } from "antd"

//ipc
import { startCapture, cancelCapture, resetCaptureState } from "../ipcHandler"

//types
import { StateType } from "../../shared/reducers"

const ButtonBase: React.FC<{
  onClick:
    | ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void)
    | undefined
}> = ({ onClick, children }) => {
  return (
    <Button size="large" block type="primary" onClick={onClick}>
      {children}
    </Button>
  )
}

const ControlButton = React.memo<{
  captureState: StateType["capture"]["captureState"]
}>(({ captureState }) => {
  switch (captureState) {
    case "idle":
      return (
        <ButtonBase onClick={startCapture}>キャプチャを開始する</ButtonBase>
      )

    case "progress":
    case "stopping":
      return (
        <ButtonBase onClick={cancelCapture}>
          キャプチャを一時停止する
        </ButtonBase>
      )

    case "stop":
      return (
        <Space
          direction="vertical"
          size="middle"
          style={{
            width: "100%",
          }}
        >
          <ButtonBase onClick={startCapture}>キャプチャを再開する</ButtonBase>
          <ButtonBase onClick={resetCaptureState}>
            再度キャプチャジョブを登録する
          </ButtonBase>
        </Space>
      )

    case "done":
      return (
        <ButtonBase onClick={resetCaptureState}>
          再度キャプチャジョブを登録する
        </ButtonBase>
      )

    default:
      return null
  }
})

ControlButton.displayName = "ControlButton"

const Capture: React.FC = () => {
  const captureState = useSelector(
    (state: StateType) => state.capture.captureState
  )
  return <ControlButton captureState={captureState} />
}

export default Capture
