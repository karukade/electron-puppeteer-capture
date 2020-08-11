import React from "react"
import styled from "styled-components"
import { Space, Typography } from "antd"

const { Text, Paragraph } = Typography

const Row = styled.div`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: 16px;
  }
`

const Col = styled.div<{ flex: string }>`
  flex: ${({ flex }) => flex};
`

const ColUaText = styled(Col)`
  overflow: hidden;
  display: flex;
  align-items: center;
  > * + * {
    margin-left: 16px;
  }
`
//types
import { DeviceInfoType } from "../../main/services/devices"

const DeviceItem: React.FC<{
  device: DeviceInfoType
}> = ({ device }) => {
  return (
    <>
      <Row>
        <Col flex="1 0 250px">{device.name}</Col>
        <Col flex="1 0 120px">
          <Space size="small">
            <span>
              <Text disabled>W×H</Text>
            </span>
            <span>
              {device.viewport.width}
              <Text type="secondary">×</Text>
              {device.viewport.height}
            </span>
          </Space>
        </Col>
        <ColUaText flex="0 1 auto">
          <Text disabled>userAgent</Text>
          <Paragraph
            style={{
              marginBottom: 0,
            }}
            ellipsis
          >
            {device.userAgent}
          </Paragraph>
        </ColUaText>
      </Row>
    </>
  )
}

export default DeviceItem
