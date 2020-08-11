import React from "react"
import { useSelector } from "react-redux"
import { Space } from "antd"

//components
import BasicAuthListItem from "./BasicAuthListItem"

//types
import { StateType } from "../../shared/reducers/"

const BasicAuthLists: React.FC = () => {
  const authLists = useSelector((store: StateType) => store.basicAuth.authLists)
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {authLists.map((authInfo) => (
        <BasicAuthListItem key={authInfo.id} authInfo={authInfo} />
      ))}
    </Space>
  )
}

export default BasicAuthLists
