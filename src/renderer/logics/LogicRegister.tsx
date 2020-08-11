import React, { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button, Form } from "antd"

//components
import LogicInputs from "./LogicInputs"

// types
import { LogicInfo } from "../../main/services/logics"
import { StateType } from "../../shared/reducers/"

// ipc
import { setLogic as ipcSetLogic } from "../ipcHandler"

// action
import { setLogicEditorValue } from "../../shared/actions/rendererEditor"

const validate = (info: LogicInfo) => {
  return Object.entries(info).every(
    ([key, value]) => key === "description" || !!value
  )
}

const LogicRegister: React.FC = () => {
  const dispatch = useDispatch()
  const logic = useSelector(
    (state: StateType) => state.rendererEditor.logicEditor
  )

  const onChange = useCallback(
    (value: { [K in keyof LogicInfo]?: string }) =>
      dispatch(setLogicEditorValue(value)),
    [dispatch]
  )

  const onSubmit = () => {
    if (!validate(logic)) return
    ipcSetLogic(logic)
    dispatch(
      setLogicEditorValue({
        name: "",
        description: "",
        value: "",
      })
    )
  }

  return (
    <Form layout="vertical">
      <LogicInputs onChange={onChange} logicInfo={logic} />
      <Button onClick={onSubmit} type="primary" size="large">
        ロジックを登録
      </Button>
    </Form>
  )
}

export default LogicRegister
