import React from "react"
import styled from "styled-components"
import { Space } from "antd"
import { FileImageOutlined, FilePdfOutlined } from "@ant-design/icons"

// types
import { CaptureTarget } from "../../main/services/urlListParser"
import { OutputType } from "../../main/services/createPuppeteerHandler"
import { DeviceType } from "../../main/services/devices"

const outputsType: OutputType[] = ["img", "pdf"]
const devices: DeviceType[] = ["pc", "tablet", "sp"]

const hasOutputsType = (
  targetsList: OutputType[] | undefined,
  outputType: OutputType
) => targetsList && targetsList.includes(outputType)

const formatDeviceName = (deviceName: DeviceType) => {
  return deviceName === "tablet" ? "TB" : deviceName.toUpperCase()
}

const Tag = styled.div<{ active?: boolean; index: number }>`
  background-color: ${({ active }) => (active ? "#fff" : "inherit")};
  color: ${({ active }) => (active ? "inherit" : "#707070")};
  border-left: ${({ index }) => (index > 0 ? "solid 1px #E2E2E2" : "none")};
  font-size: 11px;
  font-weight: bold;
  line-height: 1;
  width: 25px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Content = styled.span`
  display: flex;
  align-items: center;
  border: solid 1px #e2e2e2;
  border-radius: 2px;
  margin-bottom: 0px;
  overflow: hidden;
`

const Wrapper = styled.div`
  display: flex;
  > * + * {
    margin-left: 20px;
  }
`

const tags = (
  targets: CaptureTarget,
  devices: DeviceType[],
  output: OutputType
) =>
  devices.map((device, i) => (
    <Tag
      active={hasOutputsType(targets[device], output)}
      index={i}
      key={device}
    >
      {formatDeviceName(device)}
    </Tag>
  ))

const CaptureTargets: React.FC<{ targets: CaptureTarget }> = ({ targets }) => {
  return (
    <Wrapper>
      {outputsType.map((output) => (
        <Space key={output} size="small" style={{ fontSize: "17px" }}>
          {output === "img" ? <FileImageOutlined /> : <FilePdfOutlined />}
          <Content>{tags(targets, devices, output)}</Content>
        </Space>
      ))}
    </Wrapper>
  )
}

export default CaptureTargets
