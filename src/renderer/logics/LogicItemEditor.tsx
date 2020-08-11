import React, { useReducer, useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Space, Button } from "antd"
import actionCreatorFactory from "typescript-fsa"
import { reducerWithoutInitialState } from "typescript-fsa-reducers"

// components
import LogicInputs from "./LogicInputs"

// actions
import { setEditingLogicItem } from "../../shared/actions/rendererEditor"

// types
import { StateType } from "../../shared/reducers/"
import { LogicInfo } from "../../main/services/logics"

export type EditorStateType = {
  logic: LogicInfo
  prevLogic?: string
}

export type Props = {
  logic: LogicInfo
  onDone: (data: EditorStateType) => void
  onCancel: () => void
}

const actionCreator = actionCreatorFactory()

// actions
const itemStateActions = {
  updateLogic: actionCreator<{ [K in keyof LogicInfo]?: string }>(
    "UPDATE_LOGIC"
  ),
  setPrevLogicName: actionCreator<void>("UPDATE_PREV_LOGIC"),
}

// reducer
const itemStateReducer = reducerWithoutInitialState<EditorStateType>()
  .case(itemStateActions.updateLogic, (state, logic) => ({
    ...state,
    logic: {
      ...state.logic,
      ...logic,
    },
  }))
  .case(itemStateActions.setPrevLogicName, (state) => ({
    ...state,
    prevLogic: state.logic.name,
  }))

// component
const LogicItemEditor: React.FC<Props> = ({ logic, onDone, onCancel }) => {
  const cachedLogic = useSelector(
    ({ rendererEditor: { editingItemsValue, editingItems } }: StateType) =>
      editingItems.includes(logic.name) ? editingItemsValue?.[logic.name] : null
  )

  const [itemState, dispatch] = useReducer(itemStateReducer, {
    logic: cachedLogic || { ...logic },
    prevLogic: logic.name,
  })

  const storeDispatch = useDispatch()

  const onChange = useCallback((value: { [K in keyof LogicInfo]?: string }) => {
    dispatch(itemStateActions.updateLogic(value))
  }, [])

  const done = useCallback(() => {
    onDone(itemState)
  }, [itemState, onDone])

  const cancel = useCallback(() => onCancel(), [onCancel])

  // 初期化、editorの値のアップデート時にstoreに値をキャッシュする
  useEffect(() => {
    storeDispatch(
      setEditingLogicItem({ name: logic.name, value: itemState.logic })
    )
  }, [logic.name, itemState.logic, storeDispatch])

  return (
    <Space
      direction="vertical"
      style={{
        width: "100%",
      }}
    >
      <LogicInputs logicInfo={itemState.logic} onChange={onChange} />
      <Space>
        <Button size="large" type="primary" onClick={done}>
          更新する
        </Button>
        <Button size="large" onClick={cancel}>
          キャンセル
        </Button>
      </Space>
    </Space>
  )
}

export default LogicItemEditor
