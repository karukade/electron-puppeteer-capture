import React from "react"
import { useSelector } from "react-redux"
import { List } from "antd"
import LogicItem from "./LogicItem"

// types
import { LogicInfo } from "../../main/services/logics"
import { StateType } from "../../shared/reducers"

const renderItem = ([key, logic]: [string, LogicInfo]) => (
  <LogicItem key={key} logic={logic} />
)

const LogicsList: React.FC = () => {
  const logics = useSelector((store: StateType) => store.logics.logics)
  console.log("LogicsList")
  return (
    <>
      {logics && (
        <List
          itemLayout="vertical"
          size="large"
          dataSource={[...logics]}
          renderItem={renderItem}
        />
      )}
    </>
  )
}

export default LogicsList
