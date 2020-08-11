import React, { useEffect } from "react"
import { BrowserRouter as Router } from "react-router-dom"

import "antd/dist/antd.css"

import TabNav from "./common/TabNav"
import Contents from "./common/Contents"
import Layout from "./common/Layout"
import { requestInitialData } from "./ipcHandler"

const App: React.FC = () => {
  useEffect(() => {
    requestInitialData()
  }, [])
  return (
    <>
      <Router>
        <Layout nav={<TabNav />} contents={<Contents />} />
      </Router>
    </>
  )
}

export default App
