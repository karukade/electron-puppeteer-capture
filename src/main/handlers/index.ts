import { actions, ActionsType } from "../../common/actions"

export const handlers = {
  [actions.GET_INIT_DATA]: () => {
    return "INIT_DATA"
  },
}

handlers?.[actions.GET_INIT_DATA]?.()
