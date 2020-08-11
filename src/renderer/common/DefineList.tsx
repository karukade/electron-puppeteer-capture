import React from "react"
import { Typography, Col, Row } from "antd"

const { Text } = Typography

const DefineList: React.FC<{
  label: React.ReactNode
}> = ({ label, children }) => {
  return (
    <Row gutter={8} align="middle">
      <Col>
        <Text type="secondary">{label}</Text>
      </Col>
      <Col flex="auto 1 0">{children}</Col>
    </Row>
  )
}

export default DefineList
