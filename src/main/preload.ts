import path from "path"
import { ipcRenderer } from "electron"
window.ipcRenderer = ipcRenderer
// eslint-disable-next-line @typescript-eslint/camelcase
window.__webpack_public_path__ = path.join(__dirname, "../renderer/")
