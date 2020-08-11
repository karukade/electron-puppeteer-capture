import React from "react"
import styled from "styled-components"
import { Row, Col, Space } from "antd"

// components
import CaptureTargets from "./CaptureTargets"
import TitleStatus from "./TitleStatus"
import Logic from "./Logic"

// types
import { CaptureTargetInfo } from "../../main/services/urlListParser"

const Wrapper = styled.dl`
  padding: 20px;
  margin: 0;
  border-top: 1px solid #ededed;
`

const UrlListItem: React.FC<{
  listItem: CaptureTargetInfo
  style?: React.CSSProperties
}> = ({ listItem, style }) => {
  const {
    url,
    capturing,
    captureTargets,
    invalidUrl,
    done,
    status,
    logic,
    title,
  } = listItem
  return (
    <Wrapper style={style}>
      <Space style={{ width: "100%" }} direction="vertical" size="small">
        <Row justify="space-between" align="middle">
          <Col>
            <TitleStatus
              info={{
                capturing,
                status,
                title,
              }}
            />
          </Col>
          <Col>
            <CaptureTargets targets={captureTargets} />
          </Col>
        </Row>
        <div style={{ fontSize: "16px" }}>{url}</div>
        <Logic logic={logic} />
      </Space>
    </Wrapper>
  )
}

export default UrlListItem
