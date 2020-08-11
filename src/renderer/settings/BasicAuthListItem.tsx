import React, { useState, useCallback } from "react"
import { List, Row, Col } from "antd"
import { useDispatch } from "react-redux"

// components
import BasicAuthInfoItem from "./BasicAuthInfoItem"
import BasicAuthEditor from "./BasicAuthEditor"
import EditButton from "../common/EditButton"

//action
import {
  updateBasicAuth,
  removeBasicAuth,
} from "../../shared/actions/basicAuth"

// types
import { AuthInfo } from "../../main/services/basicAuth"

const LogicItem: React.FC<{
  authInfo: AuthInfo
}> = ({ authInfo }) => {
  const { id, ...partialInfo } = authInfo
  const [editing, setEditing] = useState(false)

  const dispatch = useDispatch()

  const edit = useCallback(() => setEditing(true), [])

  const cancel = useCallback(() => {
    setEditing(false)
  }, [])

  const onDone = useCallback(
    (authInfo: Omit<AuthInfo, "id">) => {
      setEditing(false)
      dispatch(updateBasicAuth({ ...authInfo, id }))
    },
    [dispatch]
  )

  const remove = useCallback(() => {
    dispatch(removeBasicAuth(authInfo.id))
  }, [dispatch, authInfo])

  return (
    <Row gutter={8} justify="space-between">
      <Col flex="auto 1 0">
        {editing ? (
          <BasicAuthEditor initialValue={partialInfo} onDone={onDone} />
        ) : (
          <BasicAuthInfoItem info={partialInfo} />
        )}
      </Col>
      <Col>
        <EditButton
          editing={editing}
          cancel={cancel}
          edit={edit}
          remove={remove}
        />
      </Col>
    </Row>
  )
}

export default React.memo(LogicItem)
