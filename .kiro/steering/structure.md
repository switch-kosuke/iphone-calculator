# プロジェクト構造

## 構成方針

フラット構成（すべてルートディレクトリに配置）。
機能ごとにファイルを分割し、責務を明確化する。

## ファイルパターン

### エントリーポイント
**場所**: `index.html`, `index.js`
**目的**: HTMLマークアップ（ボタンレイアウト・Tailwind設定）と、イベント登録・レンダリングのメインロジック
**例**: `index.js` の `initCalculator()` が全イベントリスナーを登録し、`render()` でDOMを更新

### 状態・ロジック層
**場所**: `calculator-state.js`
**目的**: 計算エンジン（`CalculatorEngine`）と状態管理関数（`createCalculatorState`, `handleDigitInput` 等）
**原則**: 副作用なし（DOM非依存）。テストから直接 `require` 可能

### ビュー層（予約）
**場所**: `calculator-view.js`
**目的**: 将来のビューユーティリティ用。現在は空のプレースホルダー

### テスト
**場所**: `test-engine.js`, `test-state.js`
**目的**: 各レイヤーの単体テスト（Node.js直接実行）
**命名規則**: `test-{対象ファイル名}.js`

## 命名規則

- **ファイル**: `kebab-case`（例: `calculator-state.js`）
- **関数**: `camelCase`（例: `handleDigitInput`, `createCalculatorState`）
- **定数オブジェクト**: `PascalCase`（例: `CalculatorEngine`）
- **HTMLデータ属性**: `data-action`, `data-digit`（kebab-case）

## コード構成の原則

- 状態は `createCalculatorState()` で生成したオブジェクトに集約
- DOMへのアクセスは `index.js` の `render()` のみ
- `calculator-state.js` はNode.js・ブラウザ両対応（末尾の `module.exports` 条件分岐）
- スペック仕様は `.kiro/specs/` に、ステアリングは `.kiro/steering/` に配置

---
_ファイルツリーではなくパターンを記載する。パターンに従う新規ファイルは更新不要_
