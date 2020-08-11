import React from "react"
import { Space } from "antd"
import {
  DesktopOutlined,
  TabletOutlined,
  MobileOutlined,
} from "@ant-design/icons"

//components
import DeviceItem from "./DeviceItem"

//types
import { DeviceInfoType, DeviceType } from "../../main/services/devices"

const getIcon = (type: DeviceType) =>
  type === "pc" ? (
    <DesktopOutlined />
  ) : type === "tablet" ? (
    <TabletOutlined />
  ) : (
    <MobileOutlined />
  )

const DeviceList: React.FC<{
  devices: DeviceInfoType[]
  type: DeviceType
}> = ({ devices, type }) => {
  return (
    <dl>
      <dt
        style={{
          marginBottom: "0.5em",
        }}
      >
        {getIcon(type)} {type.toUpperCase()}
      </dt>
      <dd>
        <Space direction="vertical" style={{ width: "100%" }}>
          {devices.map((device) => (
            <DeviceItem key={device.name} device={device} />
          ))}
        </Space>
      </dd>
    </dl>
  )
}

export default DeviceList
