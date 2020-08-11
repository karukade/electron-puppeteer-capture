import React from "react"
import { Row, Col } from "antd"

//components
import DefineList from "../common/DefineList"

//types
import { AuthInfo } from "../../main/services/basicAuth"

const BasicAuthInfoItem: React.FC<{
  info: Omit<AuthInfo, "id">
}> = ({ info }) => {
  return (
    <Row gutter={16}>
      <Col>
        <DefineList label="host">{info.host}</DefineList>
      </Col>
      <Col>
        <DefineList label="id">{info.username}</DefineList>
      </Col>
      <Col>
        <DefineList label="password">{info.password}</DefineList>
      </Col>
    </Row>
  )
}

export default BasicAuthInfoItem
