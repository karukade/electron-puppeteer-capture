import React from "react"
import { useSelector } from "react-redux"
import { Button, Space, Tooltip, Input } from "antd"
import { FileTextOutlined } from "@ant-design/icons"

// types
import { EnvStateType } from "../../shared/reducers/env"
import { StateType } from "../../shared/reducers/"

const getFileName = (path: string, platform: EnvStateType["platform"]) => {
  if (platform === null) return path
  const startIndex =
    platform === "win32" ? path.lastIndexOf("\\") : path.lastIndexOf("/")
  return `..${path.substring(startIndex)}`
}

const FileSelect: React.FC<{
  onClick: () => any
  children: React.ReactNode
  icon?: React.ReactNode
}> = ({ onClick, children, icon }) => {
  const platform = useSelector((state: StateType) => state.env.platform)
  return (
    <>
      <Tooltip placement="top" title={children}>
        <Button
          onClick={onClick}
          block
          style={{
            overflow: "hidden",
          }}
        >
          <Space
            style={{
              width: "100%",
            }}
          >
            {icon ? icon : <FileTextOutlined />}
            <Input
              style={{
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
              type="text"
              readOnly
              value={
                children
                  ? getFileName(children as string, platform)
                  : "選択してください"
              }
            />
          </Space>
        </Button>
      </Tooltip>
    </>
  )
}

export default React.memo(FileSelect)
