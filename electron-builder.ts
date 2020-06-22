import { Configuration } from "electron-builder"

const config: Configuration = {
  productName: "puppeeteer-capture",
  files: ["app/**/*"],
  directories: {
    buildResources: "resources",
  },
  win: {
    target: ["nsis"],
  },
}

export default config
