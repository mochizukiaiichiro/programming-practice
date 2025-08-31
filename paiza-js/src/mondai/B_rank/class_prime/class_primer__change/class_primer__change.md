# 構造体の更新（paiza ランク C 相当）for JavaScript

構造体の更新（paiza ランク C 相当）の JavaScript の回答例を作成しました。
問題から与えられる値の取得には [splitTokens.js](https://qiita.com/mochizukiaiichiro/items/4a3d098aa38b40803318)を使用しています。

https://paiza.jp/works/mondai/class_primer/class_primer__change

## splitTokens.js とは

splitTokens.js は単一行や複数行の半角/全角スペース、タブ、カンマ、改行が混在した文字列を配列に変換する関数です。問題の入力処理を省略することでアルゴリズムのプログラミングのみに集中できます。

Qiita：[【JavaScript】paiza や競プロの標準入力のプログラミング（splitTokens.js）](https://qiita.com/mochizukiaiichiro/items/4a3d098aa38b40803318)
GitHub：[splitTokens.js — 汎用入力パーサ for Node.js](https://github.com/mochizukiaiichiro/splitTokens)

## 解答コード例

```javascript
// （１）入力処理
const input = splitTokens(require('fs').readFileSync(0, 'utf8'));
const [[n], ...rest] = input;

// （２）データ変換処理（配列→構造体）
const members = rest
  .slice(0, n)
  .map(([nickname, old, birth, state]) => ({ nickname, old, birth, state }));

// （３）データ更新処理（nicknameを更新）
rest.slice(n).forEach(([i, name]) => {
  members[i - 1].nickname = name;
});

// （４）出力処理
members.forEach(({ nickname, old, birth, state }) => {
  console.log(`${nickname} ${old} ${birth} ${state}`);
});
```

<details>
<summary>splitTokens</summary>

```javascript
// 変換関数
function splitTokens(input) {
  const normalized = normalizeInput(input);
  const isSingleLine = !normalized.includes('\n');
  // 単一行か複数行で処理を分岐
  return isSingleLine ? parseSingleLine(normalized) : parseMultiLine(normalized);
}

// 入力文字列を正規化
function normalizeInput(str) {
  return str
    .replace(/\r\n?/g, '\n') // 改行統一
    .replace(/\t/g, ' ') // タブ → 半角スペース
    .replace(/\u3000/g, ' ') // 全角スペース → 半角スペース
    .replace(/,/g, ' ') // カンマ → 半角スペース
    .trim(); // 前後空白除去
}

// 一行の文字列を一次元配列に変換
function parseSingleLine(str) {
  return str
    .split(/ +/) // 半角スペースで分割
    .filter((s) => s.trim() !== '') // 空要素削除
    .map((s) => (/^[-+]?\d*\.?\d+$/.test(s) ? Number(s) : s)); // 数値文字列を数値に変換
}

// 複数行の文字列を二次元配列に変換
function parseMultiLine(str) {
  return str
    .split('\n')
    .filter((s) => s.trim() !== '') // 空要素削除
    .map(parseSingleLine);
}
```

</details>

## 解説

### （１）入力処理

#### （１－１）問題の読み込み

標準入力（0 は stdin のファイルディスクリプタ）から問題の文字列を読み込みます。
読み込んだ文字列を、splitTokens.js で配列化します。

```js:入力処理
const input = splitTokens(require('fs').readFileSync(0, 'utf8'));
```

問題からは次のようなデータが入力されます。

```text:入力値
3 2
taro 20 2000-01-01 Tokyo
hanako 25 1995-05-05 Osaka
jiro 30 1990-10-10 Fukuoka
1  ichiro
2  saburo

```

splitTokens.js で二次元配列に変換され input は次のようになります。

```js:inputの値
[
  [3, 2],
  ['taro', 20, '2000-01-01', 'Tokyo'],
  ['hanako', 25, '1995-05-05', 'Osaka'],
  ['jiro', 30, '1990-10-10', 'Fukuoka'],
  [1, 'ichiro'],
  [2, 'saburo'],
];
```

#### （１－２）問題データの変換

読み込んだ問題の二次元配列のデータを分割代入で取得し、プログラムで使用できる形に変換します。

```js:問題データの変換
const [[n], ...rest] = input;
```

[[n], ...rest] の [n] の部分で要素 0 の[3, 2]の 3 （クラスの人数）を取得します。

```js:nの値
3
```

[[n], ...rest] の ...rest の部分ではスプレッド構文により、最初の要素以外（クラスメートの情報、更新情報）をまとめて取得します。

```js:restの値
[
  ['taro', 20, '2000-01-01', 'Tokyo'],
  ['hanako', 25, '1995-05-05', 'Osaka'],
  ['jiro', 30, '1990-10-10', 'Fukuoka'],
  [1, 'ichiro'],
  [2, 'saburo'],
];
```

### （２）データ変換処理（配列 → 構造体）

クラスメートの情報を配列型からオブジェクト型に変換します。

```js:データ変換処理（配列 → 構造体）
const members = rest.slice(0, n).map(([nickname, old, birth, state]) => (
    { nickname, old, birth, state }
    ));
```

rest.slice(0, n)によりクラスメートの情報のみを抜き出します。

```js:rest.slice(0, n)の値
[
  ['taro', 20, '2000-01-01', 'Tokyo'],
  ['hanako', 25, '1995-05-05', 'Osaka'],
  ['jiro', 30, '1990-10-10', 'Fukuoka'],
];
```

map(([nickname, old, birth, state])の部分で分割代入を使用してデータを取得します。['taro', 20, '2000-01-01', 'Tokyo']のデータが nickname='taro',old=20,birth='2000-01-01',state='Tokyo'と代入されます。

=> ({ nickname, old, birth, state }))の部分で、オブジェクトリテラルの省略記法を使用してオブジェクトに変換します。
オブジェクトリテラルの省略記法は、プロパティ名と値の変数名が同じ場合に、{ 変数名 } の形式で書くことができ、{プロパティ名:変数名}という記述を省略します。

```js:membersの値
[
  {nickname:'taro', old:20, birth:'2000-01-01', state:'Tokyo'},
  {nickname:'hanako', old:25, birth:'1995-05-05', state:'Osaka'},
  {nickname:'jiro', old:30, birth:'1990-10-10', state:'Fukuoka'},
];
```

### （３）データ更新処理（nickname を更新）

更新情報でクラスメートの情報を更新します。

```js:データ更新処理（nickname を更新）
rest.slice(n).forEach(([i, name]) => {
  members[i - 1].nickname = name;
});
```

rest.slice(n)により更新情報のみを抜き出します。

```js:rest.slice(n)の値
[
  [1, 'ichiro'],
  [2, 'saburo'],
];
```

.forEach(([i, name]) の部分で分割代入を使用してデータを取得します。[1, 'ichiro']のデータが i=1,name='ichiro'と代入されます。
=> { members[i - 1].nickname = name; });の部分で nickname を更新します。

### （４）出力処理

更新したクラスメートの情報を出力します。

```js:出力処理
members.forEach(({ nickname, old, birth, state }) => {
  console.log(`${nickname} ${old} ${birth} ${state}`);
});
```

.forEach(({ nickname, old, birth, state }) の部分で分割代入を使用してデータを取得しています。分割代入部分はオブジェクト型のデータのため({})と記述します。（配列の場合は([])と記述します。）
=> { console.log(`${nickname} ${old} ${birth} ${state}`); });の部分はテンプレートリテラルを使用して変数を文字列に変換しています。

```text:出力結果
ichiro 20 2000-01-01 Tokyo
saburo 25 1995-05-05 Osaka
jiro 30 1990-10-10 Fukuoka
```
