import React from "react"
import { useSelector } from "react-redux"
import { Row, Col, Input, Button, Form } from "antd"

import { CheckOutlined } from "@ant-design/icons"

// types
import { AuthInfo } from "../../main/services/basicAuth"

// selector
import { basicAuthListsKeys } from "../../shared/selectors"

type OmittedAuthInfo = Omit<AuthInfo, "id">
type OmittedAuthInfoKey = keyof OmittedAuthInfo
type FormItemProps = React.ComponentProps<typeof Form.Item>

export type BasicAuthEditorProps = {
  initialValue: OmittedAuthInfo
  onDone: (authInfo: OmittedAuthInfo) => void
}

const getValidationRule = (
  name: OmittedAuthInfoKey,
  storedDomains: string[]
): FormItemProps["rules"] => {
  switch (name) {
    case "host":
      return [
        { required: true, message: `${name}は必須です` },
        {
          validator: (rules, value) => {
            try {
              const url = new URL(`https://${value}`)
              return url.host !== value
                ? Promise.reject(`${name}が不正な値です`)
                : Promise.resolve()
            } catch (e) {
              return Promise.reject()
            }
          },
        },
        {
          validator: (rules, value) => {
            return storedDomains.includes(value)
              ? Promise.reject(`すでに登録されている${name}です`)
              : Promise.resolve()
          },
        },
      ]
    case "password":
    case "username":
      return [{ required: true, message: `${name}は必須です` }]
  }
}

const getFormItemProps = (
  name: OmittedAuthInfoKey,
  storedDomains: string[]
): FormItemProps => ({
  label: name,
  name,
  rules: getValidationRule(name, storedDomains),
  normalize:
    name === "host"
      ? (value: string) => value.replace(/^https?:\/\//, "")
      : undefined,
})

const BasicAuthEditor: React.FC<BasicAuthEditorProps> = ({
  initialValue,
  onDone,
}) => {
  const storedAuthDomains = useSelector(basicAuthListsKeys)
  console.log(storedAuthDomains)
  return (
    <Form initialValues={initialValue} onFinish={onDone as any}>
      <Row
        justify="space-between"
        gutter={8}
        style={{
          width: "100%",
        }}
      >
        <Col flex="auto 1 0">
          <Row gutter={16}>
            {Object.entries(initialValue).map(([key]) => (
              <Col span={8} key={key}>
                <Form.Item
                  {...getFormItemProps(
                    key as OmittedAuthInfoKey,
                    storedAuthDomains
                  )}
                >
                  <Input />
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Col>
        <Col>
          <Button htmlType="submit" shape="circle" icon={<CheckOutlined />} />
        </Col>
      </Row>
    </Form>
  )
}

export default BasicAuthEditor
