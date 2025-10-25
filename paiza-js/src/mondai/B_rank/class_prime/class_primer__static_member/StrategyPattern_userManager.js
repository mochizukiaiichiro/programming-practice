import fs from 'fs';
import splitTokens from '../../../../util/splitTokens-js/src/splitTokens.js';

// ===== 定数 =====
const BEER_PRICE = 500;
const FOOD_DISCOUNT = 200;
const LEGAL_DRINKING_AGE = 20;

const ORDER_BEER = 0;
const ORDER_FOOD = 'food';
const ORDER_SOFT = 'softdrink';
const ORDER_ALCOHOL = 'alcohol';
const ORDER_CHECKOUT = 'A';

// ===== ユーザクラス =====
class User {
	static totalCustomers = 0;
	static #salesList = [];

	static addSale(amount) {
		User.#salesList.push(amount);
	}

	static getSalesList() {
		return [...User.#salesList];
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

// ===== 基底戦略クラス =====
class BaseOrderStrategy {
	execute(user, type, amount) {
		if (type === ORDER_SOFT) {
			user.payment.push(amount);
		} else if (type === ORDER_CHECKOUT) {
			const total = user.payment.reduce((sum, cur) => sum + cur, 0);
			User.totalCustomers++;
			User.addSale(total);
			user.payment = [];
			user.discount = false;
		} else {
			this.handleSpecificOrder(user, type, amount);
		}
	}

	handleSpecificOrder(user, type, amount) {
		throw new Error('handleSpecificOrder() must be implemented');
	}
}

// ===== 未成年戦略 =====
class MinorOrderStrategy extends BaseOrderStrategy {
	handleSpecificOrder(user, type, amount) {
		if (type === ORDER_FOOD) {
			user.payment.push(amount);
		}
		// 酒類は無視
	}
}

// ===== 成年戦略 =====
class AdultOrderStrategy extends BaseOrderStrategy {
	handleSpecificOrder(user, type, amount) {
		if (type === ORDER_BEER) {
			user.payment.push(BEER_PRICE);
			user.discount = true;
		} else if (type === ORDER_ALCOHOL) {
			user.payment.push(amount);
			user.discount = true;
		} else if (type === ORDER_FOOD) {
			user.payment.push(user.discount ? amount - FOOD_DISCOUNT : amount);
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

// ===== ユーザー管理クラス =====
class MapUserManager {
	constructor() {
		this.users = new Map();
	}

	hasUser(id) {
		return this.users.has(id);
	}

	createUser(id, userInstance) {
		if (!this.users.has(id)) {
			this.users.set(id, userInstance);
		}
	}

	getUser(id) {
		return this.users.get(id);
	}

	removeUser(id) {
		this.users.delete(id);
	}
}

// ===== メイン処理 =====
const input = splitTokens(fs.readFileSync(0, 'utf8'));
const [[n], ...rest] = input;

// 年齢リスト（一次元配列に変換）
const ageList = rest.slice(0, n).map(([age]) => age);

// 管理クラス初期化
const userManager = new MapUserManager();

// 注文処理
rest.slice(n).forEach(([id, order, orderAmount = 0]) => {
	if (!userManager.hasUser(id)) {
		const age = ageList[id - 1];
		const user = UserFactory.create(age);
		userManager.createUser(id, user);
	}

	const user = userManager.getUser(id);
	user.order(order, orderAmount);

	if (order === ORDER_CHECKOUT) {
		userManager.removeUser(id);
	}
});

// 出力
User.getSalesList().forEach(amount => console.log(amount));
console.log(User.totalCustomers);
