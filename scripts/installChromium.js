const path = require("path")
const puppeteer = require("puppeteer")

const {
  // eslint-disable-next-line @typescript-eslint/camelcase
  puppeteer: { chromium_revision },
} = require("../node_modules/puppeteer/package.json")

const { hasDirOrFile, archiveDir, ProgressBar } = require("./utils")
const dist = path.resolve(__dirname, "../app/chromium.zip")

const main = async () => {
  if (process.env.SPEARS_CHECK_CHROMIUM && (await hasDirOrFile(dist))) return
  let progressBar
  const browserFetcher = puppeteer.createBrowserFetcher()

  console.log("downloading chromium")
  const revisionInfo = await browserFetcher.download(
    chromium_revision,
    (downloadedBytes, totalBytes) => {
      if (!progressBar) {
        progressBar = new ProgressBar(totalBytes, 0)
        return
      }
      progressBar.update(downloadedBytes)
    }
  )
  const chromePath = path.dirname(revisionInfo.executablePath)

  console.log("downloaded chromium", chromePath)

  console.log(`archiving to ${dist}. please wait...`)

  await archiveDir(chromePath, dist)

  console.log(`archived ${dist}`)
  process.exit(0)
}

main()
