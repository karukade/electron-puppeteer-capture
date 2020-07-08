const path = require("path")
const merge = require("webpack-merge")

const baseConfig = require("./webpack.base.config")
const projectRoot = path.resolve(__dirname, "..")

module.exports = merge.smart(baseConfig, {
  target: "electron-main",
  entry: {
    index: path.join(projectRoot, "src/main", "index.ts"),
    preload: path.join(projectRoot, "src/main", "preload.ts"),
  },
  devtool: process.env.NODE_ENV === "development" ? "inline-source-map" : false,
  output: {
    path: path.join(projectRoot, "app/main"),
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: {
    // puppeteer peer dependencies
    "utf-8-validate": "utf-8-validate",
    bufferutil: "bufferutil",
  },
})
