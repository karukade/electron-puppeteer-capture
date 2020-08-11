import React, { useCallback, useState } from "react"
import { Input, Space, Form } from "antd"

// ipc
import { logicTest } from "../ipcHandler"

//components
import Editor from "../common/Editor"

// types
import { LogicInfo } from "../../main/services/logics"
import { ForMattedResultType } from "../../main/ipc/logicTest"

type ValidateStatus = Parameters<typeof Form.Item>[number]["validateStatus"]

const getValidateStatus = (result?: ForMattedResultType): ValidateStatus =>
  !result ? "validating" : result.error ? "error" : "success"

const LogicResult: React.FC<{
  result: ForMattedResultType
}> = ({ result }) =>
  result.error === "LOGIC_EVALUATE_ERROR" ? (
    <>
      <p>{result.message}</p>
      {result.stack && <p>{result.stack}</p>}
    </>
  ) : (
    <p>{result.message}</p>
  )

const LogicInputs: React.FC<{
  onChange: (
    value: { [K in keyof LogicInfo]?: string },
    lastLogicInfo?: LogicInfo
  ) => void
  logicInfo?: LogicInfo
}> = ({ logicInfo, onChange }) => {
  const [logicTestResult, setLogicTestResult] = useState<ForMattedResultType>()
  const inputOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value, name } = e.target
      onChange({
        [name]: value,
      })
    },
    [onChange]
  )

  const editorOnChange = useCallback(
    (value: string) => {
      onChange({
        value,
      })
    },
    [onChange]
  )

  const test = (url: string) => {
    logicInfo &&
      logicTest(url, logicInfo?.value).then((result) => {
        setLogicTestResult(result)
      })
  }

  return (
    <Space
      direction="vertical"
      size="small"
      style={{
        width: "100%",
      }}
    >
      <Form.Item label="ロジック名">
        <Input
          value={logicInfo?.name}
          type="text"
          name="name"
          onChange={inputOnChange}
        />
      </Form.Item>
      <Form.Item label="ロジック">
        <Editor value={logicInfo?.value} onChange={editorOnChange} />
      </Form.Item>
      <Form.Item
        label="ロジックをテストする"
        help={logicTestResult && <LogicResult result={logicTestResult} />}
        validateStatus={getValidateStatus(logicTestResult)}
      >
        <Input.Search
          onSearch={test}
          placeholder="urlを入力"
          enterButton="ロジックをテストする"
        />
      </Form.Item>
    </Space>
  )
}

export default LogicInputs
