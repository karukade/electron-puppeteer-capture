import React from "react"
import { useSelector } from "react-redux"

import { StateType } from "../shared/reducers"

const App: React.FC = () => {
  const state = useSelector((state: StateType) => state)
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
