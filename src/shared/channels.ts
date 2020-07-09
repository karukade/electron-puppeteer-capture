export const channels = {
  REQ_INIT_DATA: "REQ_INIT_DATA",
  READ_URL_LIST: "READ_URL_LIST",
  START_CAPTURE: "START_CAPTURE",
} as const

export type ChannelsType = typeof channels[keyof typeof channels]
