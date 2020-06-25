import fs from "fs"
import path from "path"
import unzipper from "unzipper"

import * as utils from "../utils"

const chromiumZipPath = path.resolve(__dirname, "../chromium.zip")

export const extractChromium = async () => {
  return new Promise((resolve, reject) => {
    fs.createWriteStream(utils.chromiumPath).pipe(
      unzipper
        .Extract({
          path: chromiumZipPath,
        })
        .on("close", () => {
          resolve()
        })
    )
  })
}
