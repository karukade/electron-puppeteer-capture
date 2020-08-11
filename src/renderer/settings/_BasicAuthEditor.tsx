import React, { useState } from "react"
import { Row, Col, Input, Button, Space } from "antd"

import { CheckOutlined } from "@ant-design/icons"

//components
import DefineList from "../common/DefineList"

// types
import { AuthInfo } from "../../main/services/basicAuth"

type OmittedAuthInfo = Omit<AuthInfo, "id">

export type BasicAuthEditorProps = {
  initialValue: OmittedAuthInfo
  onDone: (authInfo: OmittedAuthInfo) => void
}

const isValidAuthInfo = (authInfo: OmittedAuthInfo) =>
  Object.entries(authInfo).every(([, value]) => value !== "")

const BasicAuthEditor: React.FC<BasicAuthEditorProps> = ({
  initialValue,
  onDone,
}) => {
  const [value, setValue] = useState({ ...initialValue })
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValue((authInfo) => ({
      ...authInfo,
      [name]: value,
    }))
  }
  const done = () => {
    console.log("done")
    if (!isValidAuthInfo(value)) return
    onDone(value)
  }
  return (
    <Row
      justify="space-between"
      gutter={8}
      style={{
        width: "100%",
      }}
    >
      <Col>
        <Row gutter={16}>
          {Object.entries(value).map(([key, value]) => (
            <Col key={key}>
              <DefineList
                label={key}
                data={<Input name={key} value={value} onChange={onChange} />}
              />
            </Col>
          ))}
        </Row>
      </Col>
      <Col>
        <Button shape="circle" onClick={done} icon={<CheckOutlined />} />
      </Col>
    </Row>
  )
}

export default BasicAuthEditor
