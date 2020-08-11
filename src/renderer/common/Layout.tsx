import React from "react"
import { Layout as AntdLayout } from "antd"

const { Content, Sider } = AntdLayout

const Layout: React.FC<{
  nav: React.ReactNode
  contents: React.ReactNode
}> = ({ nav, contents }) => (
  <AntdLayout>
    <Sider collapsed={true}>{nav}</Sider>
    <Content
      style={{
        minHeight: "100vh",
      }}
    >
      {contents}
    </Content>
  </AntdLayout>
)

export default Layout
