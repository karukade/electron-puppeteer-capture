import path from "path"
import ExcelJS from "exceljs"

import { DeviceType } from "./devices"
import { errCodes } from "../errHandler"

import { OutputType } from "./createPuppeteerHandler"

// import { promisify } from "util"
// import { imageSize } from "image-size"

// const so = promisify(imageSize)
// const img = "data/capture.png"

// const addImage = (workBook: ExcelJS.Workbook, filename: string): number => {
//   return workBook.addImage({
//     filename,
//     extension: "png",
//   })
// }

const listBoolValue = {
  true: 1,
  false: 0,
}

const expectedHeader = [
  "url",
  "logic",
  "pc",
  "sp",
  "tablet",
  "pc_pdf",
  "sp_pdf",
  "tablet_pdf",
] as const

const deviceHeader = expectedHeader.slice(2)

type HeadersType = typeof expectedHeader[number]
export type CaptureTarget = {
  [K in DeviceType]?: OutputType[]
}
export type CaptureTargetInfo = {
  title: string
  index: number
  url: string
  status: number | string | null
  done: boolean
  capturing: boolean
  invalidUrl: boolean
  captureTargets: CaptureTarget
  logic: string | null
}
export type UrlListType = Map<number, CaptureTargetInfo>
export type ArrayedUrlListType = CaptureTargetInfo[]

const isHyperlink = (value: Exclude<ExcelJS.CellValue, number | string>) => {
  if (!value) return false
  const keys = Object.keys(value)
  return keys.includes("text") && keys.includes("hyperlink")
}

const getValue = (value: ExcelJS.CellValue) => {
  if (value === null || typeof value === "string" || typeof value === "number")
    return value
  if (!isHyperlink(value)) throw new Error(errCodes.INVALID_EXCEL)
  const { text } = value as ExcelJS.CellHyperlinkValue
  try {
    return typeof text === "string"
      ? text
      : (text as { richText: ExcelJS.RichText[] }).richText[0].text
  } catch (e) {
    throw new Error(errCodes.INVALID_EXCEL)
  }
}

const getCaptureTargetValue = (
  value: string | number | null,
  key: HeadersType
): { device: DeviceType; output: OutputType } | null => {
  if (value === listBoolValue.true) {
    const [device, output] = key.split("_") as [DeviceType, OutputType]
    return {
      device,
      output: output || "img",
    }
  }
  return null
}

export const isValidUrl = (url: string | number | null) =>
  typeof url === "string" &&
  /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(
    url
  )

export const createLogicTestUrlList = (
  url: string,
  logic: string,
  device: DeviceType = "pc"
): UrlListType =>
  new Map([
    [
      1,
      {
        title: "",
        url,
        status: null,
        done: false,
        capturing: false,
        invalidUrl: isValidUrl(url),
        captureTargets: { [device]: ["img"] },
        index: 1,
        logic,
      },
    ],
  ])

export const parseList = async (src: string, sheetId = 1) => {
  const workBook = new ExcelJS.Workbook()
  await workBook.xlsx.readFile(src)
  const workSheet = workBook.getWorksheet(sheetId)
  const urlList: UrlListType = new Map()
  const header: HeadersType[] = []
  workSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    const targetInfo = {
      title: "",
      capturing: false,
      done: false,
      status: null,
    } as CaptureTargetInfo
    const captureTargets: CaptureTarget = {}

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      //header
      if (rowNumber === 1) {
        if (
          !(typeof cell.value === "string") &&
          !expectedHeader.includes(cell.value as any)
        )
          throw new Error(errCodes.INVALID_EXCEL)

        header.push((cell.value as string).toLowerCase() as HeadersType)
        return
      }

      //contents
      const key = header[colNumber - 1]
      const val = getValue(cell.value)

      switch (key) {
        case "url":
          targetInfo[key] = String(val)
          targetInfo.invalidUrl = !isValidUrl(val)
          break

        case "logic":
          if (val !== null && typeof val !== "string") break
          targetInfo[key] = val
          break

        default: {
          if (!deviceHeader.includes(key)) break
          const captureTarget = getCaptureTargetValue(val, key)
          if (!captureTarget) break
          const { device, output } = captureTarget
          captureTargets[device] = captureTargets[device] || []
          captureTargets[device]?.push(output)
        }
      }
    })

    if (rowNumber === 1) return
    targetInfo.index = rowNumber - 1
    targetInfo.captureTargets = captureTargets
    urlList.set(targetInfo.index, targetInfo)
  })
  return urlList
}

// ;(async () => {
//   // const {width, height} = await so(img) as {width: number, height: number}
//   // const sheet = workBook.addWorksheet('sheet 1')
//   // sheet.addImage(addImage(workBook, img), {
//   //   tl: {col: 0, row: 0},
//   //   ext: {width, height}
//   // })
//   await readExcel(path.resolve(__dirname, "../data/urls.xlsx"), 1)
// })()
