const path = require("path")
const { spawn } = require("child_process")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const merge = require("webpack-merge")
const baseConfig = require("./webpack.base.config")

const projectRoot = path.resolve(__dirname, "..")
const DEV_SERVER_PORT = 8080;

module.exports = merge.smart(baseConfig, {
  target: "web",
  entry: path.join(projectRoot, "src/renderer/index.tsx"),
  output: {
    filename: "index.js",
    path: path.join(projectRoot, "app/renderer"),
  },
  devtool: process.env.NODE_ENV === "dev" ? "inline-source-map" : false,
  devServer: {
    contentBase: path.join(projectRoot, "app/renderer"),
    // after: (app, server) => {
    //   spawn('npm', ['run', 'electron'], {
    //     shell: true,
    //     env: {
    //       "WEBPACK_DEV_PORT": server.port
    //     }
    //   }).on('error', (spawnError) => console.error(spawnError));
    // }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(projectRoot, "src/renderer/index.html"),
    }),
  ]
})
