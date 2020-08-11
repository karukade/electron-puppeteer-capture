import React from "react"
import { Modal, Row, Col } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

const WaitStopModal: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <Modal
      visible={visible}
      title="キャプチャをキャンセルしています。そのままお待ちください。"
    >
      <Row justify="center">
        <Col>
          <LoadingOutlined style={{ fontSize: "30px" }} />
        </Col>
      </Row>
    </Modal>
  )
}

export default WaitStopModal
