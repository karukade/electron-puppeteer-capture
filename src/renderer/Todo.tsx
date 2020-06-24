import React, { useState } from "react"
import TodoTxt from "./TodoTxt"

import { actions } from "../common/actions"

const ipcRenderer = window.ipcRenderer

const Todo: React.FC = () => {
  const [input, setInput] = useState("")
  const [todo, setTodo] = useState("")
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") return
    setInput(e.target.value)
  }
  const onClick = async () => {
    console.log(input)
    const data = await ipcRenderer.invoke(actions.GET_INIT_DATA)
    console.log(data)
  }
  ipcRenderer.on("load-txt", (event, data) => {
    setTodo(data)
  })
  return (
    <div>
      <input onInput={onInput} type="text" />
      <button onClick={onClick}>ADD</button>
      <TodoTxt todo={todo} />
    </div>
  )
}

export default Todo
