import React, { useState, useCallback } from "react"
import { List } from "antd"
import { useDispatch, useSelector } from "react-redux"

// components
import LogicItemEditor, { EditorStateType } from "./LogicItemEditor"
import EditButton from "../common/EditButton"

// ipc
import { updateLogic } from "../ipcHandler"

//action
import { removeLogic } from "../../shared/actions/logics"

// actions
import { removeEditingLogicItem } from "../../shared/actions/rendererEditor"

// types
import { StateType } from "../../shared/reducers/"
import { LogicInfo } from "../../main/services/logics"

const LogicItem: React.FC<{
  logic: LogicInfo
}> = ({ logic }) => {
  const isEditing = useSelector(
    ({ rendererEditor: { editingItems } }: StateType) =>
      editingItems.includes(logic.name)
  )

  const [editing, setEditing] = useState(isEditing)

  const dispatch = useDispatch()

  const edit = useCallback(() => setEditing(true), [])

  const cancel = useCallback(() => {
    setEditing(false)
    dispatch(removeEditingLogicItem(logic.name))
  }, [logic.name, dispatch])

  const onDone = useCallback(
    (data: EditorStateType) => {
      updateLogic({
        logic: data.logic,
        lastLogicName: data.prevLogic,
      })
      setEditing(false)
      dispatch(removeEditingLogicItem(logic.name))
    },
    [logic.name, dispatch]
  )

  const remove = useCallback(() => {
    dispatch(removeLogic(logic))
  }, [dispatch, logic])

  return (
    <List.Item
      style={{
        backgroundColor: "#fff",
      }}
      extra={
        <EditButton
          editing={editing}
          cancel={cancel}
          edit={edit}
          remove={remove}
        />
      }
    >
      {editing ? (
        <LogicItemEditor onCancel={cancel} onDone={onDone} logic={logic} />
      ) : (
        <>
          <List.Item.Meta title={logic.name} description={logic.description} />
          <pre>
            <code>{logic.value}</code>
          </pre>
        </>
      )}
    </List.Item>
  )
}

export default React.memo(LogicItem)
