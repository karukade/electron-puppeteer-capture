import React from "react"
import { Space } from "antd"
import { CodeOutlined } from "@ant-design/icons"

// types
import { CaptureTargetInfo } from "../../main/services/urlListParser"

type PropsType = {
  logic: CaptureTargetInfo["logic"]
}

const Logic: React.FC<PropsType> = ({ logic }) => (
  <Space size="small">
    <CodeOutlined
      style={{
        fontSize: "17px",
      }}
    />
    {logic}
  </Space>
)

export default Logic
