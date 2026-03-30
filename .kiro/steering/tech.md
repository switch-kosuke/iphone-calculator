# 技術スタック

## アーキテクチャ

ビルドステップなし・フレームワークなしのバニラJS Webアプリ。
すべての処理をブラウザで完結させる。MVC的な責務分離を採用:
- **Model**: `calculator-state.js` — 状態と演算ロジック
- **View/Controller**: `index.js` — DOM操作・イベント処理・レンダリング
- **View予約**: `calculator-view.js` — 将来のビューユーティリティ用（現在は空）

## コア技術

- **言語**: JavaScript (ES6+, CommonJS `module.exports` 併用)
- **スタイリング**: Tailwind CSS (CDNから読み込み、ビルド不要)
- **ランタイム**: ブラウザ（本番）/ Node.js（テスト実行）

## 開発標準

### テスト
- カスタムミニテストランナー（`assertEqual` / `assert` ヘルパー）
- Node.jsで直接実行: `node test-engine.js` / `node test-state.js`
- テスト対象: CalculatorEngine（演算・フォーマット）、state関数（入力・クリア・演算）

### コード品質
- 外部リンター・バンドラー不使用
- 状態変更はすべてハンドラ関数（`handleDigitInput` 等）経由で行い、直接操作しない

## 重要な技術的決定

| 決定 | 理由 |
|------|------|
| 浮動小数点補正に`toPrecision(12)`使用 | `0.1+0.2=0.3`問題の回避 |
| 1e9以上は指数表記 | 表示桁数の制限対応 |
| CommonJS `module.exports` をブラウザコードに追加 | Node.jsテストとブラウザ両対応 |
| Tailwind CSS CDN | ビルド環境なしでユーティリティCSSを利用 |

---
_パターンと規約を記載する。全依存関係の列挙は不要_
