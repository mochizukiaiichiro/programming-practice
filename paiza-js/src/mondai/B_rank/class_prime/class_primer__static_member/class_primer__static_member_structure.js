import fs from 'fs';
import splitTokens from '../../../../util/splitTokens-js/src/splitTokens.js'

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

// データ変換処理（配列→構造体）
const users = rest.slice(0, n).map(([old]) => ({
	old,
	discount: false,
	payment: []
}));

const accounting = [];

// 注文処理
rest.slice(n).forEach(([id, order, orderAmount]) => {
	const user = users[id - 1];

	// ビール
	if (order === ORDER_BEER && user.old >= 20) {
		user.payment.push(BEER_PRICE);
		user.discount = true;
	}

	// 食事
	if (order === ORDER_FOOD) {
		user.payment.push(user.discount ? orderAmount - FOOD_DISCOUNT : orderAmount)
	}

	// ソフトドリンク
	if (order === ORDER_SOFT) {
		user.payment.push(orderAmount);
	}

	// アルコール
	if (order === ORDER_ALCOHOL && user.old >= 20) {
		user.payment.push(orderAmount);
		user.discount = true;
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
accounting.forEach(a => console.log(a));
console.log(accounting.length);