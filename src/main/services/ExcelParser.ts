import path from "path"
import ExcelJS from "exceljs"

import { errCodes } from "../errHandler"
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

export const readExcel = async (src: string, sheetId = 1) => {
  const workBook = new ExcelJS.Workbook()
  await workBook.xlsx.readFile(src)
  const workSheet = workBook.getWorksheet(sheetId)
  let header!: string[]
  const result: { [key: string]: any }[] = []

  workSheet.eachRow({ includeEmpty: false }, (row) => {
    if (!Array.isArray(row.values)) throw new Error(errCodes.INVALID_EXCEL)

    const filtered = row.values.filter((value) => typeof value === "string")

    if (filtered.length === 0) throw new Error(errCodes.INVALID_EXCEL)

    if (!header) {
      header = filtered as string[]
      return
    }

    const formatted = filtered.reduce((acc, curr, i) => {
      acc[header[i]] = typeof curr === "string" ? curr : (curr as any)?.text
      return acc
    }, {} as { [k: string]: ExcelJS.CellValue })

    result.push(formatted)
  })

  return result
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
