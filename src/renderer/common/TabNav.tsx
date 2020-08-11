import React from "react"
import { Menu } from "antd"
import {
  CameraOutlined,
  SettingOutlined,
  CodeOutlined,
} from "@ant-design/icons"
import styled from "styled-components"
import { Link } from "react-router-dom"

const Container = styled.nav`
  color: #fff;
`

const TabNav: React.FC = () => (
  <Container>
    <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
      <Menu.Item key="1" icon={<CameraOutlined />}>
        <Link to="/">Capture</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<CodeOutlined />}>
        <Link to="/logics">logics</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<SettingOutlined />}>
        <Link to="/settings">settings</Link>
      </Menu.Item>
    </Menu>
  </Container>
)

export default TabNav
