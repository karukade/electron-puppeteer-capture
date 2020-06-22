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

- IPC制御用のクラスつくる

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

# VSCODEのBrowserWindowの制御Class
[https://github.com/microsoft/vscode/blob/01630824e85deec96d37ee99c4f8c86ee23aa016/src/vs/code/electron-main/window.ts](https://github.com/microsoft/vscode/blob/01630824e85deec96d37ee99c4f8c86ee23aa016/src/vs/code/electron-main/window.ts)

# ウィンドウを違和感なく表示する

1. `ready-to-show`イベントを使用する
レンダラーがはじめてレンダリングが完了したときに`ready-to-show`イベントが発生する。

```js
let win = new BrowserWindow({ show: false })
win.once('ready-to-show', () => {
  win.show()
})
```

2. アプリの背景に近い backgroundColor を使う
```js
let win = new BrowserWindow({ backgroundColor: '#2e2c29' })
```



# 開発環境

## development

1. renderer processをwebpack-dev-serverでコンパイルlocalhostで起動する
2. main の　BrowserWindowからはloadFromUrlでdevServerで起動したlocalhostを読み込む
   - mainのindex.ts は開発時はwebpackでコンパイルせずts-node/registare で起動する
     - `electron -r ts-node/register ./src/main/index.ts`



```
my-app/
├── package.json
├──config/
  ├webpack.renderer.config.js
  ├webpack.main.config.js
├── src/
│		├──renderer/
│			├──index.ts
│			├──index.html ## tempalate for HtmlWebpackPlugin
│		├──main/
│    	├──index.ts
│
tsconfig.json
│ 
## build output
├── build/
│   ├──renderer/
│		│		├──index.js
│		│		├──index.html
│		├──main/
│				├──index.js	
│				├──preload.js	
│
├── resoruces/
	├──mac/
	├──windows/
## distribution packges
└── dist/
    ├── mac/
    │   └── my-app.app
    └── my-app-0.1.0.dmg

```

