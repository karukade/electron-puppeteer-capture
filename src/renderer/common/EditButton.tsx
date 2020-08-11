import React from "react"
import { Button, Space } from "antd"

import {
  CloseOutlined,
  CheckOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons"

type ClickHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
type HandlerTypes = "edit" | "cancel" | "done" | "remove"
type Props = {
  editing: boolean
} & {
  [K in HandlerTypes]?: ClickHandler
}

const getIcon = (type: HandlerTypes) =>
  type === "edit" ? (
    <EditOutlined />
  ) : type === "cancel" ? (
    <CloseOutlined />
  ) : type === "done" ? (
    <CheckOutlined />
  ) : (
    <DeleteOutlined />
  )

const getButton = (type: HandlerTypes, handleClick?: ClickHandler) =>
  handleClick ? (
    <Button shape="circle" onClick={handleClick} icon={getIcon(type)} />
  ) : null

const EditButton: React.FC<Props> = ({
  editing,
  edit,
  cancel,
  done,
  remove,
}) => {
  return editing ? (
    <Space size="small">
      {getButton("done", done)}
      {getButton("cancel", cancel)}
    </Space>
  ) : (
    <Space size="small">
      {getButton("edit", edit)}
      {getButton("remove", remove)}
    </Space>
  )
}

export default React.memo(EditButton)
