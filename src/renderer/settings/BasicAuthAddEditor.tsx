import React from "react"
import { useDispatch } from "react-redux"
import { Form, Button, Space, Row, Col } from "antd"

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"

//components
import BasicAuthEditor from "./BasicAuthEditor"

//actions
import { addBasicAuth } from "../../shared/actions/basicAuth"

// types
import { AuthInfo } from "../../main/services/basicAuth"

type BasicAuthOnDone = React.ComponentProps<typeof BasicAuthEditor>["onDone"]
type SpaceProps = React.ComponentProps<typeof Space>

const Fields: React.FC<{
  onAddAuth: BasicAuthOnDone
  remove: (index: number) => void
  name: number
}> = ({ onAddAuth, remove, name }) => {
  const onDone = (info: Omit<AuthInfo, "id">) => {
    onAddAuth(info)
    remove(name)
  }
  const onRemove = () => {
    remove(name)
  }
  return (
    <Row>
      <Col flex="auto 1 0">
        <BasicAuthEditor
          initialValue={{
            host: "",
            username: "",
            password: "",
          }}
          onDone={onDone}
        />
      </Col>
      <Col>
        <Button shape="circle" icon={<DeleteOutlined />} onClick={onRemove} />
      </Col>
    </Row>
  )
}

const spaceProps: SpaceProps = {
  direction: "vertical",
  size: "middle",
  style: {
    width: "100%",
  },
}

const BasicAuthAddEditor: React.FC = () => {
  const dispatch = useDispatch()
  const onAddAuth = (info: Omit<AuthInfo, "id">) => {
    dispatch(addBasicAuth(info))
  }

  return (
    <Form layout="vertical" component={false}>
      <Form.List name="auth">
        {(fields, { add, remove }) => (
          <Space {...spaceProps}>
            <Space {...spaceProps}>
              {fields.map((field) => (
                <Fields
                  onAddAuth={onAddAuth}
                  key={field.key}
                  name={field.name}
                  remove={remove}
                />
              ))}
            </Space>
            <Button onClick={add} icon={<PlusOutlined />}>
              認証を追加する
            </Button>
          </Space>
        )}
      </Form.List>
    </Form>
  )
}

export default BasicAuthAddEditor
