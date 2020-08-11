import React, { useCallback } from "react"
import styled from "styled-components"
import { useDispatch } from "react-redux"
import { Select, Space, Typography } from "antd"

const { Text, Paragraph } = Typography
const { Option } = Select

const Row = styled.div`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: 16px;
  }
`

const Col = styled.div<{ flex: string }>`
  flex: ${({ flex }) => flex};
`

const ColUaText = styled(Col)`
  overflow: hidden;
  display: flex;
  align-items: center;
  > * + * {
    margin-left: 16px;
  }
`
//types
import { DeviceInfoType } from "../../main/services/devices"

const presetsOption = (presets: DeviceInfoType[]): React.ReactNode[] =>
  presets.map((data) => (
    <Option key={data.name} value={data.name}>
      {data.name}
    </Option>
  ))

const PresetsSelect: React.FC<{
  onChange: (value: string) => void
  presets: DeviceInfoType[]
  defaultValue?: string
}> = ({ onChange, presets, defaultValue }) => {
  return (
    <Select
      style={{
        width: "100%",
      }}
      defaultValue={defaultValue}
      placeholder="デバイスを選択してください"
      onChange={onChange}
    >
      {presetsOption(presets)}
    </Select>
  )
}

export default PresetsSelect
