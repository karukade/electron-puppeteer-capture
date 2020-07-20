import path from "path"
import { devices } from "puppeteer"
import * as utils from "../utils"
import { DeviceStateType } from "../../shared/reducers/devices"

export type DeviceType = "pc" | "sp" | "tablet"
export type DeviceInfoType = devices.Device & {
  type: DeviceType
}
export type DeviceListsType = {
  [K in DeviceType]: DeviceInfoType[]
}

const deviceFilePath = path.join(utils.userDataDir, "devices.json")

export const readDevicesFromFile = async () => {
  if (!(await utils.hasDirOrFile(deviceFilePath))) return null
  const devices = await utils.fsPromises.readFile(deviceFilePath, {
    encoding: "utf-8",
  })
  return JSON.parse(devices) as DeviceListsType
}

export const writeLogicFile = async (devices: DeviceListsType) => {
  await utils.fsPromises.writeFile(deviceFilePath, JSON.stringify(devices))
}

const detectDeviceType = (name: string): DeviceType => {
  return name.includes("ipad") ? "tablet" : "sp"
}

const defDeviceName = {
  sp: "iPhone 8",
  tablet: "iPad",
} as const

export const getDevicePresets = (): DeviceListsType => {
  return Object.entries(devices).reduce((acc, [deviceName, device]) => {
    const name = deviceName.toLowerCase()
    if (!/(?:galaxy|iphone|ipad|pixel)/.test(name)) return acc
    const type = detectDeviceType(name)
    if (!acc[type]) acc[type] = []
    acc[type].push({ type, ...device })
    return acc
  }, {} as DeviceListsType)
}

export const createInitialDevice = (
  devicePresets: DeviceListsType
): DeviceListsType => {
  return {
    pc: [
      {
        type: "pc",
        viewport: {
          width: 1360,
          height: 768,
          hasTouch: false,
          deviceScaleFactor: 1,
          isLandscape: false,
          isMobile: false,
        },
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36",
        name: "Chrome",
      },
    ],
    sp: [
      devicePresets.sp.find(
        (device) => device.name === defDeviceName.sp
      ) as DeviceInfoType,
    ],
    tablet: [
      devicePresets.tablet.find(
        (device) => device.name === defDeviceName.tablet
      ) as DeviceInfoType,
    ],
  }
}
