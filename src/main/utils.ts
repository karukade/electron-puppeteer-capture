const isDevelopment = process.env.NODE_ENV !== "production"
const platform = process.platform
const isWindows = platform === "win32"
const isMacintosh = platform === "darwin"

export default {
  isWindows,
  isMacintosh,
  isDevelopment,
}
