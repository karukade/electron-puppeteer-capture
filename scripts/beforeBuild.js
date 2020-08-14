const fs = require("fs-extra")
const path = require("path")

;(async () => {
  const packageJsonPath = path.resolve(__dirname, "../src/app.package.json")
  const destPackageJson = path.resolve(__dirname, "../app/package.json")
  await fs.copy(packageJsonPath, destPackageJson)
})()
