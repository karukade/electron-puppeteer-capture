const path = require("path")
const fs = require("fs").promises
const { hasDirOrFile } = require("./utils")
const download = require("./installChromium")

//ダウンロードするchromiumのplatform
const supportedPlatforms = ["win64", "mac"]

const alreadyPrepared = async (paths) => {
  const hasDirs = await Promise.all(paths.map((path) => hasDirOrFile(path)))
  return hasDirs.every((hasDir) => hasDir)
}
;(async () => {
  const urlListPath = path.resolve(__dirname, "../src/urls.zip")
  const urlListDist = path.resolve(__dirname, "../app/urls.zip")
  const downloadArgs = supportedPlatforms.map((platform) => [
    platform,
    path.resolve(__dirname, `../app/chromium/${platform}`),
  ])
  if (
    await alreadyPrepared([
      ...downloadArgs.map(([, dist]) => dist),
      urlListDist,
    ])
  )
    return console.log("already prepared")
  await fs.mkdir(path.resolve(__dirname, "../app"), { recursive: true })
  await Promise.all([
    ...downloadArgs.map(([platform, dist]) => download(platform, dist)),
    fs.copyFile(urlListPath, urlListDist),
  ])
})()
