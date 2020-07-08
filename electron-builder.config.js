module.exports = {
  productName: "puppeeteer-capture",
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
