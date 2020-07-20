export const channels = {
  REQ_INIT_DATA: "REQ_INIT_DATA",
  READ_URL_LIST: "READ_URL_LIST",
  START_CAPTURE: "START_CAPTURE",
  SET_CAPTURE_SAVE_PATH: "SET_CAPTURE_SAVE_PATH",
  CANCEL_CAPTURE: "CANCEL_CAPTURE",
} as const

export type ChannelsType = typeof channels[keyof typeof channels]
