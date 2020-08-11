import React from "react"
import { useSelector } from "react-redux"
import { Layout } from "antd"

// Components
import CaptureControl from "./CaptureControl"
import UrlList from "./UrlList"
import WaitStopModal from "./WaitStopModal"

// selector
import { getUrlListArray } from "../../shared/selectors"

//types
import { StateType } from "../../shared/reducers"

const { Content, Sider } = Layout

const Capture: React.FC = () => {
  const urlList = useSelector(getUrlListArray)
  const showWaitModal = useSelector(
    (state: StateType) => state.capture.captureState === "stopping"
  )
  return (
    <Layout>
      <Sider
        theme="light"
        width={400}
        style={{
          height: "100vh",
          padding: "40px 20px",
        }}
      >
        <CaptureControl />
      </Sider>
      <Content
        style={{
          height: "100vh",
        }}
      >
        {urlList && <UrlList list={urlList} />}
      </Content>
      <WaitStopModal visible={showWaitModal} />
    </Layout>
  )
}

export default Capture
