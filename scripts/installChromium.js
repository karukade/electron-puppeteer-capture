const path = require("path")
const puppeteer = require("puppeteer")
const { PUPPETEER_REVISIONS } = require("puppeteer/lib/cjs/revisions")
const { archiveDir, ProgressBar } = require("./utils")

//対応するplatform
const supportedPlatforms = ["win64", "mac"]

// localのダウンロード先
const downloadPath = path.resolve(__dirname, "../chromium")

const download = async (platform) => {
  let progressBar
  const browserFetcher = puppeteer.createBrowserFetcher({
    platform,
    path: downloadPath,
  })

  console.log("downloading chromium")

  const revisionInfo = await browserFetcher.download(
    PUPPETEER_REVISIONS.chromium,
    (downloadedBytes, totalBytes) => {
      if (!progressBar) {
        progressBar = new ProgressBar(totalBytes, 0)
        return
      }
      progressBar.update(downloadedBytes)
    }
  )

  const chromePath = revisionInfo.folderPath

  console.log("downloaded chromium", chromePath)
  console.log("revision info", revisionInfo)

  const dist = path.resolve(
    __dirname,
    `../app/chromium/${platform}`,
    `${path.basename(revisionInfo.folderPath)}.zip`
  )

  // zipに固めてappディレクトリに配置
  console.log(`archiving to ${dist}. please wait...`)

  await archiveDir(chromePath, dist)

  console.log(`archived at ${dist}`)
}

const main = async (platforms) => {
  for (const platform of platforms) {
    await download(platform)
  }
  process.exit(0)
}

main(supportedPlatforms)
