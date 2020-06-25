const fs = require("fs")
const fsPromises = fs.promises
const archiver = require("archiver")
const cliProgress = require("cli-progress")

const hasDirOrFile = async (dirOrFilePath) => {
  try {
    await fsPromises.access(dirOrFilePath, fs.constants.F_OK)
    return true
  } catch (e) {
    return false
  }
}

const archiveDir = async (src, dist) => {
  let resolve
  let reject
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
  const out = fs.createWriteStream(dist)
  const archive = archiver("zip", {
    zlib: { level: 9 },
  })

  out.on("close", () => {
    console.log("archive finish")
    resolve()
  })

  out.on("data", (data) => console.log(data))

  archive.on("warning", (err) => {
    if (err.code === "ENOENT") return console.log(err.stack)
    throw err
  })

  archive.on("error", (err) => {
    throw err
  })

  archive.pipe(out)
  archive.directory(src, false)
  archive.finalize()

  return promise
}

class ProgressBar {
  constructor(total, start) {
    this.bar = new cliProgress.SingleBar({
      format: `{bar} {percentage}%  {value}/{total}`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
    })
    this.bar.start(total, start)
  }

  update(value) {
    this.bar.update(value)
  }
}

module.exports = {
  hasDirOrFile,
  archiveDir,
  ProgressBar,
}
