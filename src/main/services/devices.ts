import path from "path"
import { devices } from "puppeteer"
import * as utils from "../utils"

export type DeviceType = "pc" | "sp" | "tablet"
export type DeviceInfoType = devices.Device & {
  type: DeviceType
}
export type DeviceListsType = {
  [K in DeviceType]: DeviceInfoType[]
}

export type DeviceNamesType = { [K in DeviceType]: string[] }
const deviceFilePath = path.join(utils.userDataDir, "devices.json")
const presetsFilePath = path.join(utils.userDataDir, "device-presets.json")

export const defaultDevices: DeviceNamesType = {
  pc: ["ラップトップ(1360×768)"],
  sp: ["iPhone 8"],
  tablet: ["iPad"],
}

//PuppeteerにはPCのデバイスセットがないのでここで定義
const pcPresets = [
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
    name: "ラップトップ(1360×768)",
  },
  {
    type: "pc",
    viewport: {
      width: 1440,
      height: 1024,
      hasTouch: false,
      deviceScaleFactor: 1,
      isLandscape: false,
      isMobile: false,
    },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36",
    name: "ラップトップ(1440×1024)",
  },
  {
    type: "pc",
    viewport: {
      width: 1980,
      height: 1080,
      hasTouch: false,
      deviceScaleFactor: 1,
      isLandscape: false,
      isMobile: false,
    },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36",
    name: "デスクトップ(1980×1080)",
  },
]

export const readDevicesFromFile = async () => {
  if (!(await utils.hasDirOrFile(deviceFilePath))) return null
  const devices = await utils.fsPromises.readFile(deviceFilePath, {
    encoding: "utf-8",
  })
  return JSON.parse(devices) as DeviceNamesType
}

export const writeDeviceFile = async ({
  devices,
  presets,
}: {
  devices: DeviceNamesType
  presets: DeviceListsType
}) => {
  return Promise.all([
    utils.fsPromises.writeFile(deviceFilePath, JSON.stringify(devices)),
    utils.fsPromises.writeFile(presetsFilePath, JSON.stringify(presets)),
  ])
}

const detectDeviceType = (name: string): DeviceType => {
  return name.includes("ipad") ? "tablet" : "sp"
}

export const readDevicePresetsFromFile = async (): Promise<DeviceListsType | null> => {
  if (!(await utils.hasDirOrFile(presetsFilePath))) return null
  return JSON.parse(
    await utils.fsPromises.readFile(presetsFilePath, { encoding: "utf-8" })
  ) as DeviceListsType
}

export const getDevicePresets = async (): Promise<DeviceListsType> => {
  const fromFile = await readDevicePresetsFromFile()
  const puppeteerPresets = Object.entries(devices).reduce(
    (acc, [deviceName, device]) => {
      const name = deviceName.toLowerCase()
      if (!/(?:galaxy|iphone|ipad|pixel)/.test(name)) return acc
      const type = detectDeviceType(name)
      if (!acc[type]) acc[type] = []
      acc[type].push({ type, ...device })
      return acc
    },
    {
      pc: pcPresets,
    } as DeviceListsType
  )
  return fromFile
    ? {
        ...puppeteerPresets,
        ...fromFile,
      }
    : puppeteerPresets
}
