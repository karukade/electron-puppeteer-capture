const path = require("path")
const mode =
  process.env.NODE_ENV === "development" ? "development" : "production"

module.exports = {
  mode,
  module: {
    rules: [
      {
        test: /.tsx?$/,
        exclude: [path.resolve("../node_modules")],
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".json"],
  },
}
