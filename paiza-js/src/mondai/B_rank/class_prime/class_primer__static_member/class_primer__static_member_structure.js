import fs from 'fs';
import splitTokens from '../../../../util/splitTokens-js/src/splitTokens.js'

// 定数
const BEER_PRICE = 500;
const FOOD_DISCOUNT = 200;
const LEGAL_DRINKING_AGE = 20;
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

// 注文と処理のマッピング
const orderActions = {
	[ORDER_BEER]: (u) => { if (u.old >= LEGAL_DRINKING_AGE) { u.payment.push(BEER_PRICE); u.discount = true; } },
	[ORDER_FOOD]: (u, amt) => { u.payment.push(u.discount ? amt - FOOD_DISCOUNT : amt) },
	[ORDER_SOFT]: (u, amt) => { u.payment.push(amt); },
	[ORDER_ALCOHOL]: (u, amt) => { if (u.old >= LEGAL_DRINKING_AGE) { u.payment.push(amt); u.discount = true; } },
	[ORDER_CHECKOUT]: (u) => {
		const total = u.payment.reduce((sum, cur) => sum + cur, 0);
		accounting.push(total);
		// 状態をリセット
		u.discount = false;
		u.payment = [];
	},
}

// 注文処理
rest.slice(n).forEach(([id, order, orderAmount]) => {
	const user = users[id - 1];
	orderActions[order]?.(user, orderAmount);
});

// 出力処理
accounting.forEach(a => console.log(a));
console.log(accounting.length);