const packageConfig = require("./package.json")

module.exports = {
  productName: packageConfig.name,
  directories: {
    output: "release",
  },
  // appディレクトリからの相対パス
  //chromiumは含めない
  files: ["!chromium/"],

  // chromiumのmacビルドを含める
  mac: {
    files: ["chromium/mac"],
  },
  // chromiumのwindowsビルドを含める
  win: {
    files: ["chromium/win64"],
  },
}
