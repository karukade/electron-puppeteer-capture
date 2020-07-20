import React, { useEffect } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { createGlobalStyle } from "styled-components"

import "normalize.css"

import TabNav from "./common/TabNav"
import Contents from "./common/Contents"
import Layout from "./common/Layout"
import { requestInitialData } from "./ipcHandler"

const GlobalStyle = createGlobalStyle`
ul,li {
  list-style: none;
  margin: 0;
  padding: 0;
}
p {
  margin: 0;
}
a {
  color: inherit;
  text-decoration: none;
}
`

const App: React.FC = () => {
  useEffect(() => {
    requestInitialData()
  }, [])
  return (
    <>
      <GlobalStyle />
      <Router>
        <Layout nav={<TabNav />} contents={<Contents />} />
      </Router>
    </>
  )
}

export default App
