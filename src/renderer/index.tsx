import React, { useState, useCallback } from "react"
import { render } from "react-dom"
import Todo from "./Todo"
import Counter from "./counter"

let incFunc: any

const App: React.FC = () => {
  const [int, setInt] = useState(0)
  const increment = useCallback(() => {
    setInt((prev) => {
      return prev + 1
    })
  }, [])
  if (incFunc !== increment) {
    incFunc = increment
    console.log("関数が生成された")
  }
  return (
    <div>
      <Todo />
      {int}
      <Counter onClick={increment} />
    </div>
  )
}

render(<App />, document.getElementById("app"))
