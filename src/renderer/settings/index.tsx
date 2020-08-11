import React from "react"
import { Typography } from "antd"

// components
import ContentBox from "../common/ContentBox"
import Devices from "./Devices"
import BasicAuth from "./BasicAuth"
import ContentsContainer from "../common/ContentsContainer"

const Settings: React.FC = () => {
  return (
    <ContentsContainer>
      <ContentBox>
        <Typography.Title level={4}>デバイス</Typography.Title>
        <Devices />
      </ContentBox>
      <ContentBox>
        <Typography.Title level={4}>Basic認証</Typography.Title>
        <BasicAuth />
      </ContentBox>
    </ContentsContainer>
  )
}

export default Settings
