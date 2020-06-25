import "electron"
import { handlers } from "./src/main/IpcHandler"

declare module "electron" {
  interface IpcRenderer {
    invoke<K extends keyof typeof handlers>(
      chanel: K,
      args?: string[]
    ): Promise<ReturnType<typeof handlers[K]>>
  }
}

declare global {
  interface Window {
    ipcRenderer: Electron.IpcRenderer
  }
}
