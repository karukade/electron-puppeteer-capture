import actionCreatorFactory from "typescript-fsa"

// types
import { LogicInfo } from "../../main/services/logics"

const actionCreator = actionCreatorFactory()

export const setLogicEditorValue = actionCreator<Partial<LogicInfo>>(
  "SET_LOGIC_EDITOR_VALUE"
)

export const setEditingLogicItem = actionCreator<{
  name: string
  value: LogicInfo
}>("SET_EDITING_LOGIC_ITEM")

export const removeEditingLogicItem = actionCreator<string>(
  "REMOVE_EDITING_LOGIC_ITEM"
)
