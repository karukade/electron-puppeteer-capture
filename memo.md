# 方向性

## Main process

### global

**let**
- mainWindow
- csvData
- puppeteerLauncher
- currentLogics (おそらくstop restartがあるため今どのlogicなのかを保存しておかないといけないから？、一度ファイルから読み込んだものを保持しておかないといけないから。)


### ipc
- ipcMain.on（redererからのコマンド）は別ファイルに分ける
  - イベントとコールバックが一覧できるようにしたい。
  - コマンドを定数として定義（rendererからよみだせるようにしたい  ）

### 初期化
- webContents.on("dom-ready")で初期化している
  - chromiumの解凍
  - 各種ファイルの読み込み（logic,auth,domains）rendererに送る＋globalのcurrentLogicsを初期化している。

```js
//初期描画時に必要な情報をレンダラープロセスに送る
function sendDataForInitRenderer() {
  const initData = {};
  const deviceInfo = tryReadFileSync(`${resourcePath}\\util\\devices.json`);
  const authInfo = getAuthInfos();
  const logicsInfoArray = tryReadFileSync(`${resourcePath}\\util\\logics.json`);
  const authDomain = getAuthDomains();
  if (deviceInfo) {
    initData.deviceInfo = JSON.parse(deviceInfo);
  }
  if (authInfo) {
    initData.authInfo = authInfo;
  }
  if (logicsInfoArray) {
    const logicsInfo = JSON.parse(logicsInfoArray);
    currentLogics = new Map(logicsInfo);
    initData.logicsInfo = logicsInfo;
  }
  win.webContents.send("app-inited", initData, authDomain);
}
```


###　アプリ全体のエラーハンドリング
```js
process.on("unhandledRejection", (e) => {
  if (e.message !== "not opened" && e.message !== "Page crashed!") {
    throw new Error(e);
  }
});
```