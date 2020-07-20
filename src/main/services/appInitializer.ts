import {
  extractChromium,
  getChromiumExecutablePath,
} from "./browserInitializer"
import { readLogicsFromFile } from "./logics"
import {
  readDevicesFromFile,
  getDevicePresets,
  createInitialDevice,
} from "./devices"

export const getInitializeData = async () => {
  const [chromiumExecutablePath, logics, devicesFromFile] = await Promise.all([
    extractChromium().then(getChromiumExecutablePath),
    readLogicsFromFile(),
    readDevicesFromFile(),
  ])
  const devicePresets = getDevicePresets()
  const devices = devicesFromFile || createInitialDevice(devicePresets)
  return { chromiumExecutablePath, logics, devices, devicePresets }
}
