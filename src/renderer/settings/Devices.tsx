import React, { useState, useCallback } from "react"
import { useSelector } from "react-redux"
import { Space, Button, Typography } from "antd"
import { EditOutlined } from "@ant-design/icons"

//components
import DeviceList from "./DeviceList"
import DeviceSettingModal from "./DeviceSettingModal"

//selector
import { getDevices } from "../../shared/selectors/"

//types
import { StateType } from "../../shared/reducers"
import { DeviceType } from "../../main/services/devices"

const spaceProps: React.ComponentProps<typeof Space> = {
  direction: "vertical",
  size: "large",
  style: { width: "100%" },
}

const Devices: React.FC = () => {
  const [settingModalVisible, setSettingModalVisible] = useState(false)
  const devices = useSelector(getDevices)
  const { selected: settingModalInitialValue, presets } = useSelector(
    (store: StateType) => store.devices
  )
  const onEdit = useCallback(() => {
    setSettingModalVisible(true)
  }, [])
  const close = useCallback(() => {
    setSettingModalVisible(false)
  }, [])
  return (
    <Space {...spaceProps}>
      <Space {...spaceProps}>
        {Object.entries(devices).map(([key, devices]) => (
          <DeviceList key={key} type={key as DeviceType} devices={devices} />
        ))}
      </Space>
      <Button onClick={onEdit} icon={<EditOutlined />}>
        デバイスを編集する
      </Button>
      <DeviceSettingModal
        visible={settingModalVisible}
        close={close}
        presets={presets}
        initialValue={settingModalInitialValue}
      />
    </Space>
  )
}

export default Devices
