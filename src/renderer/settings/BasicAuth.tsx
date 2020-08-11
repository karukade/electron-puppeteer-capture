import React from "react"
import { Space } from "antd"

//components
import BasicAuthAddEditor from "./BasicAuthAddEditor"
import BasicAuthList from "./BasicAuthList"

const BasicAuth: React.FC = () => (
  <Space direction="vertical" style={{ width: "100%" }}>
    <BasicAuthList />
    <BasicAuthAddEditor />
  </Space>
)

export default BasicAuth
