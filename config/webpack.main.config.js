const path = require("path")
const mode = process.env.NODE_ENV === "dev" ? "development" : "production"

module.exports = {
  mode,
  target: "electron-main",
  entry: {
    index: path.join(__dirname, "..", "src/main", "index"),
    preload: path.join(__dirname, "..", "src/main", "preload")
  },
  output: {
    path: path.resolve(__dirname, ".." , "dist/main"),
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        exclude: [path.resolve(__dirname, "node_modules")],
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
}
