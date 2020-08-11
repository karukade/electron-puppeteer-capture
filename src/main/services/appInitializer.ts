import {
  extractChromium,
  getChromiumExecutablePath,
} from "./browserInitializer"
import { readLogicsFromFile } from "./logics"
import {
  readDevicesFromFile,
  getDevicePresets,
  defaultDevices,
} from "./devices"
import { readAuthFromFile } from "./basicAuth"

export const getInitializeData = async () => {
  const [
    chromiumExecutablePath,
    logics,
    devicesFromFile,
    basicAuth,
  ] = await Promise.all([
    extractChromium().then(getChromiumExecutablePath),
    readLogicsFromFile(),
    readDevicesFromFile(),
    readAuthFromFile(),
  ])
  const devicePresets = await getDevicePresets()
  const devices = devicesFromFile || defaultDevices
  return { chromiumExecutablePath, logics, devices, devicePresets, basicAuth }
}
