const path = require("path")
const { spawn } = require("child_process")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const merge = require("webpack-merge")
const baseConfig = require("./webpack.base.config")

const projectRoot = path.resolve(__dirname, "..")
const DEV_SERVER_PORT = 8081

module.exports = merge.smart(baseConfig, {
  target: "web",
  entry: path.join(projectRoot, "src/renderer/index.tsx"),
  output: {
    filename: "index.js",
    path: path.join(projectRoot, "app/renderer"),
  },
  devtool: process.env.NODE_ENV === "dev" ? "inline-source-map" : false,
  devServer: {
    port: DEV_SERVER_PORT,
    compress: true,
    noInfo: true,
    contentBase: path.join(projectRoot, "app/renderer"),
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100,
    },
    before() {
      console.log("Starting Main Process...")
      spawn("npm", ["run", "dev:electron"], {
        shell: true,
        stdio: "inherit",
        env: Object.assign({ DEV_SERVER_PORT }, process.env),
      })
        .on("close", (code) => process.exit(code))
        .on("error", (spawnError) => console.error(spawnError))
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(projectRoot, "src/renderer/index.html"),
    }),
  ],
})
