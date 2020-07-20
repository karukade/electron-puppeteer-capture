import React from "react"
import styled from "styled-components"

const Container = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 100px 1fr;
`

const NavContainer = styled.div`
  grid-row: 1;
  grid-column: 1;
  overflow: auto;
  height: 100vh;
  background-color: #000;
  color: #fff;
`

const ContentsContainer = styled.div`
  grid-row: 1;
  grid-column: 2;
  height: 100vh;
  overflow: auto;
`

const Layout: React.FC<{
  nav: React.ReactNode
  contents: React.ReactNode
}> = ({ nav, contents }) => (
  <Container>
    <NavContainer>{nav}</NavContainer>
    <ContentsContainer>{contents}</ContentsContainer>
  </Container>
)

export default Layout
