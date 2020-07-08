import path from "path"
import puppeteer from "puppeteer"
import { app } from "electron"
import extract from "extract-zip"

import * as utils from "./utils"

const defDownloadPath = app.getPath("desktop")

export default async (executablePath: string) => {
  const browser = await puppeteer.launch({
    executablePath,
    headless: false,
  })
  const page = await browser.newPage()
  await page.goto("https://google.com", { waitUntil: "networkidle2" })

  await page.screenshot({
    path: path.join(defDownloadPath, "screenshot.png"),
  })

  browser.close()
}

export const getArchivePath = async () => {
  const platform = utils.isMacintosh ? "mac" : "win64"
  const archivePath = utils.isTest
    ? path.resolve(__dirname, `../../app/chromium/${platform}`)
    : path.resolve(__dirname, `../chromium/${platform}`)
  const fileName = await (
    await utils.fsPromises.readdir(archivePath)
  ).find((file) => /\.zip$/.test(file))

  if (!fileName) throw new Error("chromium archive not found.")

  return path.join(archivePath, fileName)
}

export const extractChromium = async () => {
  const archive = await getArchivePath()
  const extractedDir = path.resolve(
    utils.userDataDir,
    path.basename(archive, ".zip")
  )
  if (await utils.hasDirOrFile(extractedDir)) return
  await extract(archive, {
    dir: utils.userDataDir,
  })
}

export const getChromiumExecutablePath = async () => {
  // 当面 win32には対応していないがprocess.platformの値では判断できない。win32であってもwin64として返している。
  const platform =
    process.platform === "darwin"
      ? "mac"
      : process.platform === "win32"
      ? "win64"
      : null
  if (!platform) return
  const browserFetcher = puppeteer.createBrowserFetcher({
    path: utils.userDataDir,
    platform,
  })
  const revisions = await browserFetcher.localRevisions()
  const { executablePath } = browserFetcher.revisionInfo(revisions[0])
  return executablePath
}
