import { expect, test } from 'bun:test';
import { calcVipDays, type PurchaseRecord } from './calc-vip-days';

test('calc vip days', () => {
	// 示例购买记录数组
	const currentDate = new Date();
	const purchaseHistory: PurchaseRecord[] = [
		{ date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 15), days: 30 },
		{ date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 10), days: 30 },
		{ date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1), days: 30 },
	];

	const remainingDays = calcVipDays(purchaseHistory);
	expect(remainingDays).toBe(90);
});
