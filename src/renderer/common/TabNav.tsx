import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"

const Container = styled.nav`
  color: #fff;
`

const TabNav: React.FC = () => (
  <Container>
    <ul>
      <li>
        <Link to="/">Capture</Link>
      </li>
      <li>
        <Link to="/logics">logics</Link>
      </li>
      <li>
        <Link to="/settings">settings</Link>
      </li>
    </ul>
  </Container>
)

export default TabNav
