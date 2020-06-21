const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const mode = process.env.NODE_ENV === "dev" ? "development" : "production"

module.exports = {
  mode,
  target: "web",
  entry: path.join(__dirname, "..", "src/renderer", "index"),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "..", "dist/renderer"),
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        exclude: [path.resolve(__dirname, "..", "node_modules")],
        loader: "ts-loader",
      },
    ],
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, "../", "dist/", "renderer/")
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".json"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/renderer/index.html",
    }),
  ],
}
