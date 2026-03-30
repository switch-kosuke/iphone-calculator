# Requirements Document

## Introduction

iPhoneスタイル電卓WebアプリへのSubtraction（引き算）機能追加。現在は加算（+）のみ実装されており、`CalculatorEngine.calculate()` は他演算子に対して `NaN` を返す。本フィーチャーでは、−ボタンのUI追加・演算ロジック拡張・既存機能との一貫した動作・キーボード対応・テストを実現する。

## Requirements

### Requirement 1: 引き算ボタンのUI表示

**Objective:** As a ユーザー, I want 電卓に引き算（−）ボタンが表示される, so that 引き算操作を直感的に実行できる

#### Acceptance Criteria

1. The Calculator shall display a "−" button styled identically to the existing "+" button（丸型・オレンジ背景・白文字）
2. When ユーザーが−ボタンにカーソルを合わせた時, the Calculator shall `brightness-125` のホバーエフェクトを表示する
3. The Calculator shall −ボタンに `aria-label="引く"` を付与してアクセシビリティを確保する

---

### Requirement 2: 演算エンジンへの引き算サポート

**Objective:** As a ユーザー, I want 引き算が正確に計算される, so that 誤差なく減算結果を得られる

#### Acceptance Criteria

1. When `CalculatorEngine.calculate()` が `'-'` 演算子で呼び出された時, the Calculator shall `parseFloat((a - b).toPrecision(12))` を用いて結果を返す
2. When 入力が `0.3 - 0.1` の時, the Calculator shall `0.2` を返す（浮動小数点誤差補正）
3. If 引数 `a` または `b` が有限数でない時, the Calculator shall `NaN` を返す
4. When 計算結果が `1e9` 以上または `-1e9` 以下の時, the Calculator shall 指数表記で表示する

---

### Requirement 3: 引き算操作フローの動作

**Objective:** As a ユーザー, I want 加算と同じ操作感で引き算ができる, so that 学習コストなく使える

#### Acceptance Criteria

1. When ユーザーが数値入力後に−ボタンを押した時, the Calculator shall 第1オペランドを保存し次の数値入力待ち状態（`waitingForSecondOperand: true`）に移行する
2. When ユーザーが第2オペランド入力後に `=` を押した時, the Calculator shall 引き算の結果をディスプレイに表示する
3. When 計算結果が表示された後に再度 `=` を押した時, the Calculator shall 直前の第2オペランドを再利用して計算を繰り返す（例: `8 - 3 =` → `5`、再度 `=` → `2`）
4. When 引き算操作中に `+` ボタンを押した時, the Calculator shall 連続計算を実行してから演算子を `+` に切り替える
5. When 加算操作中に `−` ボタンを押した時, the Calculator shall 連続計算を実行してから演算子を `−` に切り替える

---

### Requirement 4: 演算子ハイライトの表示

**Objective:** As a ユーザー, I want 現在選択中の演算子ボタンが視覚的に強調される, so that どの演算子が選択されているかを把握できる

#### Acceptance Criteria

1. While `−` 演算子が選択され `waitingForSecondOperand` が `true` の時, the Calculator shall −ボタンを白背景・オレンジ文字で表示する
2. While `+` 演算子が選択されている時, the Calculator shall −ボタンをデフォルト（オレンジ背景・白文字）で表示する
3. When 計算が完了した時, the Calculator shall −ボタンのハイライトをデフォルト状態に戻す

---

### Requirement 5: キーボードによる引き算操作

**Objective:** As a ユーザー, I want キーボードの `−` キーで引き算を入力できる, so that マウス不要で効率的に操作できる

#### Acceptance Criteria

1. When ユーザーがキーボードの `-` キーを押した時, the Calculator shall 引き算演算子を選択する（加算の `+` キーと同様の動作）
2. When `-` キーが押された時, the Calculator shall デフォルトのブラウザ動作を抑止する（`e.preventDefault()`）

---

### Requirement 6: テストによる品質保証

**Objective:** As a 開発者, I want 引き算機能のユニットテストが存在する, so that リグレッションを防止できる

#### Acceptance Criteria

1. The Calculator shall `test-engine.js` に `CalculatorEngine.calculate()` の引き算テストケースを含む（整数・小数・負の結果）
2. The Calculator shall `test-state.js` に引き算操作フロー（入力→演算子→入力→イコール）のテストケースを含む
3. The Calculator shall 引き算の繰り返しイコール動作のテストケースを含む
4. When `node test-engine.js` および `node test-state.js` を実行した時, the Calculator shall すべてのテストが `passed` で終了する
