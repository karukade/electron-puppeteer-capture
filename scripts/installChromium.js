const path = require("path")
const puppeteer = require("puppeteer")
const { PUPPETEER_REVISIONS } = require("puppeteer/lib/cjs/revisions")
const { archiveDir, ProgressBar } = require("./utils")

// localのダウンロード先
const downloadPath = path.resolve(__dirname, "../chromium")

const download = async (platform, distDir) => {
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

  const dist = path.join(
    distDir,
    `${path.basename(revisionInfo.folderPath)}.zip`
  )

  // zipに固めてappディレクトリに配置
  console.log(`archiving to ${dist}. please wait...`)

  await archiveDir(chromePath, dist)

  console.log(`archived to ${dist}`)
}

module.exports = download
