# 静的メンバ JavaScript 編（paiza ランク B 相当）

静的メンバ （paiza ランク B 相当）の JavaScript の回答例を作成しました。
問題から与えられる値の取得には [splitTokens.js](https://qiita.com/mochizukiaiichiro/items/4a3d098aa38b40803318)を使用しています。

https://paiza.jp/works/mondai/class_primer/class_primer__static_member

## splitTokens.js とは

splitTokens.js は単一行や複数行の半角/全角スペース、タブ、カンマ、改行が混在した文字列を配列に変換する関数です。問題の入力処理を省略することでアルゴリズムのプログラミングのみに集中できます。

Qiita：[【JavaScript】paiza や競プロの標準入力のプログラミング（splitTokens.js）](https://qiita.com/mochizukiaiichiro/items/4a3d098aa38b40803318)
GitHub：[splitTokens.js — 汎用入力パーサ for Node.js](https://github.com/mochizukiaiichiro/splitTokens)

## 解答コード例１：クラスの静的メンバを使用しない

```javascript
// 定数
const BEER_PRICE = 500;
const FOOD_DISCOUNT = 200;
const ORDER_BEER = 0;
const ORDER_FOOD = 'food';
const ORDER_SOFT = 'softdrink';
const ORDER_ALCOHOL = 'alcohol';
const ORDER_CHECKOUT = 'A';

// 入力処理
const input = splitTokens(fs.readFileSync(0, 'utf8')); //const input = splitTokens(require('fs').readFileSync(0, 'utf8'));
const [[n], ...rest] = input;

// ユーザオブジェクト配列
const users = rest.slice(0, n).map(([old]) => ({
  old,
  discount: false,
  payment: [],
}));

// 客の退店時に注文した金額を格納する配列
const accounting = [];

// 注文処理
rest.slice(n).forEach(([id, order, orderAmount]) => {
  const user = users[id - 1];

  // ソフトドリンク
  if (order === ORDER_SOFT) {
    user.payment.push(orderAmount);
  }

  // ビール
  if (order === ORDER_BEER && user.old >= 20) {
    user.payment.push(BEER_PRICE);
    user.discount = true;
  }

  // アルコール
  if (order === ORDER_ALCOHOL && user.old >= 20) {
    user.payment.push(orderAmount);
    user.discount = true;
  }

  // 食事
  if (order === ORDER_FOOD) {
    user.payment.push(user.discount ? orderAmount - FOOD_DISCOUNT : orderAmount);
  }

  // 会計をして退店
  if (order === ORDER_CHECKOUT) {
    const total = user.payment.reduce((sum, cur) => sum + cur, 0);
    accounting.push(total);
    // 状態をリセット
    user.discount = false;
    user.payment = [];
  }
});

// 出力処理
accounting.forEach((a) => console.log(a));
console.log(accounting.length);
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

tbd

### 注文と処理のマッピング

```javascript
// 注文と処理のマッピング
const orderActions = {
  [ORDER_SOFT]: (u, amt) => {
    u.payment.push(amt);
  },
  [ORDER_BEER]: (u) => {
    if (u.old >= LEGAL_DRINKING_AGE) {
      u.payment.push(BEER_PRICE);
      u.discount = true;
    }
  },
  [ORDER_ALCOHOL]: (u, amt) => {
    if (u.old >= LEGAL_DRINKING_AGE) {
      u.payment.push(amt);
      u.discount = true;
    }
  },
  [ORDER_FOOD]: (u, amt) => {
    u.payment.push(u.discount ? amt - FOOD_DISCOUNT : amt);
  },
  [ORDER_CHECKOUT]: (u) => {
    const total = u.payment.reduce((sum, cur) => sum + cur, 0);
    accounting.push(total);
    // 状態をリセット
    u.discount = false;
    u.payment = [];
  },
};

// 注文処理
rest.slice(n).forEach(([id, order, orderAmount]) => {
  const user = users[id - 1];
  orderActions[order]?.(user, orderAmount);
});
```

## 解説

tbd

## 解答コード例２：クラスの静的メンバを使用する

```javascript
// 定数
const BEER_PRICE = 500;
const FOOD_DISCOUNT = 200;
const LEGAL_DRINKING_AGE = 20;
const ORDER_BEER = 0;
const ORDER_FOOD = 'food';
const ORDER_SOFT = 'softdrink';
const ORDER_ALCOHOL = 'alcohol';
const ORDER_CHECKOUT = 'A';

// ===== ユーザクラス（データ保持＋集計機能） =====
class User {
  static totalCustomers = 0; // 退店人数
  static #salesList = []; // 各ユーザの退店時金額（private）

  static addSale(amount) {
    User.#salesList.push(amount);
  }

  static getSalesList() {
    return [...User.#salesList]; // コピーを返す（外部から直接変更不可）
  }

  constructor(age, strategy) {
    this.age = age;
    this.discount = false;
    this.payment = [];
    this.strategy = strategy;
  }

  order(type, amount) {
    this.strategy.execute(this, type, amount);
  }
}

// ===== 基底戦略クラス（共通処理＋会計処理） =====
class BaseOrderStrategy {
  execute(user, type, amount) {
    // ソフトドリンク
    if (type === ORDER_SOFT) {
      user.payment.push(amount);
    }
    // 会計処理
    if (type === ORDER_CHECKOUT) {
      const total = user.payment.reduce((sum, cur) => sum + cur, 0);
      User.totalCustomers++;
      User.addSale(total);
      user.payment = [];
      user.discount = false;
    }
    // 個別処理
    this.handleSpecificOrder(user, type, amount);
  }

  handleSpecificOrder(user, type, amount) {
    throw new Error('handleSpecificOrder() must be implemented');
  }
}

// ===== 未成年戦略 =====
class MinorOrderStrategy extends BaseOrderStrategy {
  handleSpecificOrder(user, type, amount) {
    // 食事
    if (type === ORDER_FOOD) {
      user.payment.push(amount);
    }
    // 酒類は無視
  }
}

// ===== 成年戦略 =====
class AdultOrderStrategy extends BaseOrderStrategy {
  handleSpecificOrder(user, type, amount) {
    // 食事
    if (type === ORDER_FOOD) {
      user.payment.push(user.discount ? amount - FOOD_DISCOUNT : amount);
    }
    // ビール
    if (type === ORDER_BEER) {
      user.payment.push(BEER_PRICE);
      user.discount = true;
    }
    // アルコール
    if (type === ORDER_ALCOHOL) {
      user.payment.push(amount);
      user.discount = true;
    }
  }
}

// ===== Factory =====
class UserFactory {
  static create(age) {
    return age >= LEGAL_DRINKING_AGE
      ? new User(age, new AdultOrderStrategy())
      : new User(age, new MinorOrderStrategy());
  }
}

// ===== メイン処理 =====
const input = splitTokens(fs.readFileSync(0, 'utf8'));
const [[n], ...rest] = input;

const users = rest.slice(0, n).map(([age]) => UserFactory.create(age));

rest.slice(n).forEach(([id, order, orderAmount = 0]) => {
  users[id - 1].order(order, orderAmount);
});

// 出力（退店時の金額一覧と退店人数）
User.getSalesList().forEach((amount) => console.log(amount));
console.log(User.totalCustomers);
```
