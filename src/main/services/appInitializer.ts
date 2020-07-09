import { extractChromium, getChromiumExecutablePath } from "./puppeteerHandler"
import { readLogicsFromFile, LogicsType } from "./logics"

export const getInitializeData = async (): Promise<{
  chromiumExecutablePath: string
  logics: LogicsType | null
}> => {
  await extractChromium()
  const chromiumExecutablePath = await getChromiumExecutablePath()
  const logics = await readLogicsFromFile()
  return { chromiumExecutablePath, logics }
}
