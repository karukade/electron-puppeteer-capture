import { reducerWithInitialState } from "typescript-fsa-reducers"

import {
  setLogicEditorValue,
  setEditingLogicItem,
  removeEditingLogicItem,
} from "../actions/rendererEditor"

// types
import { LogicInfo } from "../../main/services/logics"

export type RendererEditorStateType = {
  logicEditor: LogicInfo
  editingItemsValue: { [k: string]: LogicInfo }
  editingItems: string[]
}

const initialState: RendererEditorStateType = {
  logicEditor: {
    name: "",
    description: "",
    value: "",
  },
  editingItemsValue: {},
  editingItems: [],
}

export default reducerWithInitialState(initialState)
  .case(setLogicEditorValue, (state, logicEditor) => ({
    ...state,
    logicEditor: {
      ...state.logicEditor,
      ...logicEditor,
    },
  }))
  .case(setEditingLogicItem, (state, logic) => {
    const hasCache = state.editingItems.includes(logic.name)
    const editingItemsValue = {
      ...state.editingItemsValue,
      [logic.name]: { ...logic.value },
    }
    return hasCache
      ? {
          ...state,
          editingItemsValue,
        }
      : {
          ...state,
          editingItemsValue,
          editingItems: [...state.editingItems, logic.name],
        }
  })
  .case(removeEditingLogicItem, (state, logicName) => {
    const hasCache = state.editingItems.includes(logicName)
    if (!hasCache) return state
    const {
      [logicName]: removeLogics,
      ...editingItemsValue
    } = state.editingItemsValue

    return {
      ...state,
      editingItemsValue,
      editingItems: state.editingItems.filter((item) => item !== logicName),
    }
  })
