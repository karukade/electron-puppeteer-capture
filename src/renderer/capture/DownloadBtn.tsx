import React from "react"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import styled from "styled-components"

// ipc
import { downloadUrlList } from "../ipcHandler"

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DownloadBtn: React.FC = () => {
  const onClickDownloadUrlList = () => {
    downloadUrlList()
  }
  return (
    <Wrapper>
      <Button icon={<DownloadOutlined />} onClick={onClickDownloadUrlList}>
        URLリストをダウンロードする
      </Button>
    </Wrapper>
  )
}

export default DownloadBtn
