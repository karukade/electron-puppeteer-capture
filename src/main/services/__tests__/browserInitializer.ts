import path from "path"
import { hasDirOrFile, userDataDir, fsPromises } from "../../utils"
import {
  getArchivePath,
  extractChromium,
  getChromiumExecutablePath,
} from "../browserInitializer"
import puppeteer from "puppeteer"

const launchPuppeteer = async (executablePath: string) => {
  try {
    const browser = await puppeteer.launch({
      executablePath,
    })
    await browser.close()
  } catch (e) {
    return Promise.reject(e)
  }
}

beforeAll(() => {
  return fsPromises.mkdir(userDataDir, { recursive: true })
})

afterAll(() => {
  return fsPromises.rmdir(userDataDir, { recursive: true })
})

describe("getArchivePath", () => {
  test("プラットフォームに合ったアーカイブへのパスを返す", async () => {
    const archivePath = await getArchivePath()
    const hasArchive = await hasDirOrFile(archivePath as string)
    expect(hasArchive).toEqual(true)
  })
})

describe("extractChromium", () => {
  test("chromiumのzipを解凍する", async () => {
    const archivedName = await getArchivePath()
    const extractedDir = path.resolve(
      userDataDir,
      path.basename(archivedName, ".zip")
    )
    await extractChromium()
    expect(await hasDirOrFile(extractedDir)).toEqual(true)
  })

  test("解凍済であれば何もしない", async () => {
    return expect(extractChromium()).resolves.toBeUndefined()
  })
})

describe("getChromiumExecutablePath", () => {
  test("puppeteerが実行可能なchromiumのパスを返す", async () => {
    const executablePath = await getChromiumExecutablePath()
    return expect(
      launchPuppeteer(executablePath as string)
    ).resolves.toBeUndefined()
  })
})
