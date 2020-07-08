export const actions = {
  GET_INIT_DATA: "GET_INIT_DATA",
  READ_URL_LIST: "READ_URL_LIST",
  START_CAPTURE: "START_CAPTURE",
} as const

export type ActionsType = typeof actions[keyof typeof actions]
