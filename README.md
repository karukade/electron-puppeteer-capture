# electron-puppeteer-xlsx（作り途中）

URLを記載したエクセルのリストを読み込んで、ページをキャプチャするツール。electron+react+typescript学習用に制作。puppeteerにelectronでUIを持たせた感じ。

## 機能
- xlsxのURLリストを読み込んでキャプチャ
- PC,Mobile,Tabletそれぞれの端末のviewportとUAを設定してキャプチャすることが可能（Puppeteerで用意されているデバイスのプリセットから選択）
- hostごとのbasic認証設定機能
- キャプチャ前にページ内で実行するjsを登録する機能

## 仕様技術
- electron
- react
- puppeteer
- redux

## 試し方
electronのパッケージ内で、puppeteerからchromiumを起動しようとするとパスが解決できずエラーになるので、chromiumのzipだけをelectronのパッケージにいれておいて初回起動時にelectronの``app.getPath("userData")``に解凍する。（開発時はプロジェクトルートの``dev-user-data``に解凍される）
```bash
# リポジトリをクローン
git clone https://github.com/karukade/electron-puppeteer-capture.git

yarn install

# chromiumをダウンロード
yarn install:chromium

# electronの起動
yarn start

# パッケージのビルド
yarn dist
```