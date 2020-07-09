import React, { useEffect } from "react"
import { useSelector } from "react-redux"

import { requestInitialData } from "./ipcHandler"
import { StateType } from "../shared/reducers"

const App: React.FC = () => {
  const state = useSelector((state: StateType) => state)

  useEffect(() => {
    requestInitialData()
  }, [])

  return (
    <>
      <div>APP</div>
      <div>
        <pre>{JSON.stringify(state, null, 4)}</pre>
      </div>
    </>
  )
}

export default App
