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
electronのパッケージ内で、puppeteerからchromiumを起動しようとするとパスが解決できずエラーになるので、chromiumのzipだけをelectronのパッケージにいれておいて初回起動時にelectronの``app.getPath("userData")``に解凍する。（開発時はプロジェクトルートの``dev-user-data``に解凍される）<br>
ビルド後のパッケージの起動オプションに``--userData=/path/to/userData``を指定することで、任意のフォルダにchromiumを解凍できる。<br>

**⚠️自前moduleをGitHub Packagesから利用しているので、``.npmrc``にgithubのpersonal access tokenを記述するかnpm.pkg.github.comにpersonal access tokenで``npm login``する必要があります**<br>

[参考](https://docs.github.com/ja/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#authenticating-to-github-packages)<br>

.npmrcを使う場合
```
//npm.pkg.github.com/:_authToken=TOKEN
```

npm loginする場合

```bash
npm login --registry=https://npm.pkg.github.com
> Username: USERNAME
> Password: TOKEN
> Email: PUBLIC-EMAIL-ADDRESS
```

```bash
# インストール
yarn

# electronの起動
yarn start

# パッケージのビルド
yarn dist

```