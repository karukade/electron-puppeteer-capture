import React from "react"
import { Route, Switch } from "react-router-dom"

import Capture from "../capture"
import Logics from "../logics"
import Settings from "../settings"

const App: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Capture />
      </Route>
      <Route exact path="/logics">
        <Logics />
      </Route>
      <Route exact path="/settings">
        <Settings />
      </Route>
    </Switch>
  )
}

export default App
