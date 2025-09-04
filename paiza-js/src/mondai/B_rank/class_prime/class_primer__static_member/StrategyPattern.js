import fs from 'fs';
import splitTokens from '../../../../util/splitTokens-js/src/splitTokens.js';

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
	static totalCustomers = 0;       // 退店人数
	static #salesList = [];          // 各ユーザの退店時金額（private）

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
const input = splitTokens(fs.readFileSync(0, 'utf8')); //const input = splitTokens(require('fs').readFileSync(0, 'utf8'));
const [[n], ...rest] = input;

const users = rest.slice(0, n).map(([age]) => UserFactory.create(age));

rest.slice(n).forEach(([id, order, orderAmount = 0]) => {
	users[id - 1].order(order, orderAmount);
});

// 出力（退店時の金額一覧と退店人数）
User.getSalesList().forEach(amount => console.log(amount));
console.log(User.totalCustomers);
