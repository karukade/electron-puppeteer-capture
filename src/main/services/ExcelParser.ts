// import path from "path"
// import * as ExcelJS from "exceljs"
// import { promisify } from "util"
// import { imageSize } from "image-size"

// const so = promisify(imageSize)
// const workBook = new ExcelJS.Workbook()
// const img = "data/capture.png"

// const addImage = (workBook: ExcelJS.Workbook, filename: string): number => {
//   return workBook.addImage({
//     filename,
//     extension: "png",
//   })
// }

// const readExcel = async (src: string, sheetId: number) => {
//   await workBook.xlsx.readFile(src)
//   const workSheet = workBook.getWorksheet(sheetId)
//   let header!: string[]
//   const result: { [key: string]: any }[] = []
//   workSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
//     if (!Array.isArray(row.values)) throw Error("Invalid Excel Value")
//     const newVal = row.values.filter(
//       (item) => item === 0 || item === "" || item
//     )
//     if (!header) {
//       if (!newVal.every((value) => typeof value === "string"))
//         throw Error("Invalid Excel Header")
//       header = newVal as string[]
//       return
//     }
//     const resObj = newVal.reduce((acc, curr, i) => {
//       acc[header[i]] = typeof curr === "string" ? curr : (curr as any)?.text
//       return acc
//     }, {} as { [k: string]: ExcelJS.CellValue })
//     result.push(resObj)
//   })
//   console.log(result)
// }

// ;(async () => {
//   // const {width, height} = await so(img) as {width: number, height: number}
//   // const sheet = workBook.addWorksheet('sheet 1')
//   // sheet.addImage(addImage(workBook, img), {
//   //   tl: {col: 0, row: 0},
//   //   ext: {width, height}
//   // })
//   await readExcel(path.resolve(__dirname, "../data/urls.xlsx"), 1)
// })()
