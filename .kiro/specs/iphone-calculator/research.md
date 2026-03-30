# リサーチ & 設計決定ログ

---
**Purpose**: ディスカバリー結果、アーキテクチャ調査、および技術設計を裏付ける根拠を記録する。
---

## Summary
- **Feature**: `iphone-calculator`
- **Discovery Scope**: Simple Addition（グリーンフィールド・UIオンリー）
- **Key Findings**:
  - 外部API・バックエンド不要。静的HTMLアプリとして実装可能
  - ステート管理はブラウザのメモリ内で完結し、永続化不要
  - 足し算のみに限定されているため、演算エンジンは最小構成で十分
  - スタイリングはTailwind CSS v3 Play CDN（ビルドなし）で対応
  - GitHub Pages（mainブランチ・ルート）で静的ファイル公開

## Research Log

### 技術スタック選定
- **Context**: フレームワーク（React/Vue等）vs バニラJSの選定
- **Sources Consulted**: プロジェクト要件・ステアリングなし
- **Findings**:
  - 単機能かつ単一画面のアプリであり、フレームワークのオーバーヘッドは不要
  - ビルドツールなしで動作する静的ファイル（HTML+CSS+JS）が最もシンプル
  - Vanilla JavaScript (ES2020) で全要件を実装可能
- **Implications**: `index.html` 1ファイル構成またはHTML/CSS/JS分離の2択。分離構成を採用してメンテナンス性を確保

### iOSカラースキームの仕様確認
- **Context**: 要件1.3のカラーコード確認
- **Findings**:
  - 数字ボタン: `#333333`（ダークグレー）
  - 演算子（+/=）ボタン: `#FF9500`（オレンジ）
  - 機能ボタン（AC/C）: `#A5A5A5`（ライトグレー）
  - 背景: `#000000`（黒）
  - テキスト: `#FFFFFF`（白）
- **Implications**: CSSカスタムプロパティ（CSS変数）で色を一元管理する

### フォントサイズ自動縮小
- **Context**: 要件5.4の実装アプローチ
- **Findings**:
  - CSS `font-size` をJSで動的に変更する方式（桁数に応じてpxを切り替え）
  - または CSS `transform: scale()` を使用する方式
  - JS動的変更方式が読みやすくシンプル
- **Implications**: 桁数閾値（7桁以上で縮小など）をCalculatorStateで管理

## Architecture Pattern Evaluation

| オプション | 説明 | 強み | リスク/制限 | 備考 |
|-----------|------|------|------------|------|
| MVC（バニラJS） | Model(状態+演算) / View(DOM) / Controller(イベント) | シンプル・依存なし・テスト容易 | クラス設計が必要 | 本アプリに最適 |
| Reactコンポーネント | React + useReducer | 状態管理が宣言的 | ビルド環境が必要・過剰 | 今回は不採用 |
| 単一スクリプト | 全ロジックを1JSファイルにフラット記述 | 最速 | テスト不可・保守困難 | 不採用 |

## Design Decisions

### Decision: `バニラJSのMVCパターンを採用`
- **Context**: フレームワーク不要の単機能アプリ
- **Alternatives Considered**:
  1. React + useReducer — 状態管理は自然だが、ビルド環境が必要
  2. フラット単一スクリプト — 最速だが保守性が低い
- **Selected Approach**: Vanilla JS ES2020、MVC分離（`calculator-state.js` + `calculator-view.js` + `index.js`）
- **Rationale**: ビルドツール不要・外部依存ゼロ・要件規模に適切
- **Trade-offs**: 型安全性はJSDocコメントで補完（TypeScriptなし）
- **Follow-up**: テスト時は`calculator-state.js`を単独でインポートして単体テスト可能か確認

### Decision: `状態をイミュータブルオブジェクトで管理`
- **Context**: 要件2.4（結果表示中の新規入力開始）・要件3.4（=連打繰り返し）の実現
- **Selected Approach**: `CalculatorState`オブジェクトに`waitingForSecondOperand`・`lastOperand`フラグを保持
- **Rationale**: 状態遷移が明確になり、バグを防止できる
- **Trade-offs**: 状態フィールドが増えるが、計算機の仕様上6フィールド以内に収まる

### Tailwind CSS CDN vs ビルド方式
- **Context**: CSSフレームワークとしてTailwind CSS採用が決定
- **Findings**:
  - **Play CDN**（`cdn.tailwindcss.com`）: ブラウザでJITコンパイル。ビルド不要で静的ファイルのみで動作。GitHub Pagesと完全互換
  - **Tailwind CLI**（npm）: ビルドステップ必要。本番最適化（未使用クラスのpurge）が可能だが今回は不要
  - iOSカラー（`#FF9500` など）はTailwindのextend設定またはインライン任意値（`bg-[#FF9500]`）で対応可能
- **Implications**: Play CDNを採用。`tailwind.config` をインラインscriptで定義し、カスタムカラーを登録する

### GitHub Pages デプロイ方式
- **Context**: 静的ファイルの公開先としてGitHub Pagesを採用
- **Findings**:
  - `main`ブランチのルート（`/`）に`index.html`があれば Settings > Pages で即公開可能
  - `docs/`フォルダ方式・`gh-pages`ブランチ方式も選択肢だが、ルート方式が最もシンプル
  - HTTPS自動対応・カスタムドメイン設定可能
- **Implications**: リポジトリルートに全ファイルを配置する構成を採用

## Risks & Mitigations
- 浮動小数点精度問題（例: `0.1 + 0.2 = 0.30000000000000004`）— `parseFloat(result.toPrecision(12))` で表示時に丸める
- 9桁オーバーフロー時の指数表記（要件5.3）— 表示フォーマット関数で判定・変換
- キーボードイベントと複数タブ — `keydown`イベントに `event.preventDefault()` を適用して意図しないスクロールを防止

## References
- [Apple iOS Human Interface Guidelines - Buttons](https://developer.apple.com/design/human-interface-guidelines/) — iOSボタンサイズ・タッチ領域（44px最小）の根拠
- [MDN - Number.prototype.toPrecision](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toPrecision) — 浮動小数点丸めの実装参考
- [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn) — ビルド不要CDN利用方法
- [GitHub Pages ドキュメント](https://docs.github.com/en/pages/getting-started-with-github-pages) — 静的サイト公開手順
