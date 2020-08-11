import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import { Modal, Checkbox, Form, Space, Row, Col } from "antd"
import styled from "styled-components"

//actions
import { setSelected } from "../../shared/actions/devices"

// types
import {
  DeviceListsType,
  DeviceInfoType,
  DeviceNamesType,
} from "../../main/services/devices"

const ScrollBox = styled.div`
  height: 30vh;
  overflow: auto;
  padding: 10px;
  border: solid 1px #efefef;
`

const checkBoxes = (devices: DeviceInfoType[]) =>
  devices.map(({ name }) => ({
    label: name,
    value: name,
  }))

const DeviceSettingModal: React.FC<{
  close: () => void
  visible: boolean
  presets: DeviceListsType
  initialValue: DeviceNamesType
}> = ({ close, visible, presets, initialValue }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const onOk = useCallback(() => {
    dispatch(setSelected(form.getFieldsValue() as DeviceNamesType))
    close()
  }, [form, dispatch, close])

  const onCancel = useCallback(() => {
    form.resetFields()
    close()
  }, [form, close])

  return (
    <Modal
      title="デバイスを選択"
      width="80%"
      onOk={onOk}
      onCancel={onCancel}
      visible={visible}
      forceRender
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValue}
        colon={false}
      >
        <Row gutter={16}>
          {Object.entries(presets).map(([key, presets]) => (
            <Col key={key} flex="30em 1 0">
              <Form.Item name={key} label={key.toUpperCase()}>
                <Checkbox.Group style={{ width: "100%" }}>
                  <ScrollBox>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      {checkBoxes(presets).map(({ label, value }) => (
                        <Checkbox key={value} value={value}>
                          {label}
                        </Checkbox>
                      ))}
                    </Space>
                  </ScrollBox>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  )
}

export default React.memo(DeviceSettingModal)
