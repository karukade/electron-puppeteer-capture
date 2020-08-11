import React from "react"
import styled from "styled-components"
import { Row, Col, Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

// types
import { CaptureTargetInfo } from "../../main/services/urlListParser"

type PropsType = {
  info: Pick<CaptureTargetInfo, "title" | "capturing" | "status">
}

const getBgColor = (status?: CaptureTargetInfo["status"]) =>
  !status ? "#d4d4d4" : status === 200 ? "#5FCEAC" : "#F77474"

const PlaceHolder = styled.span<{ status?: string }>`
  display: inline-block;
  height: 10px;
`

const Dot = styled(PlaceHolder)`
  width: 10px;
  border-radius: 50%;
  background-color: ${({ status }) => getBgColor(status)};
`

const Line = styled(PlaceHolder)`
  background-color: #d4d4d4;
  width: 56px;
  border-radius: 6px;
`

const spinIco = <LoadingOutlined style={{ fontSize: "24px" }} />

const Capture: React.FC<PropsType> = ({
  info: { title, capturing, status },
}) => {
  return (
    <Row gutter={4} align="middle">
      <Col>
        {capturing ? <Spin indicator={spinIco} /> : <Dot status={status} />}
        {status}
      </Col>
      <Col>{title ? title : <Line />}</Col>
    </Row>
  )
}

export default Capture
