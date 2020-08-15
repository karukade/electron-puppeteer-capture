import React from "react"
import { Route, Switch } from "react-router-dom"

import Capture from "../capture"
import Logics from "../logics"
import Settings from "../settings"

const App: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/logics">
        <Logics />
      </Route>
      <Route exact path="/settings">
        <Settings />
      </Route>
      <Route path="/">
        <Capture />
      </Route>
    </Switch>
  )
}

export default App
