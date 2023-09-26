export interface PurchaseRecord {
	date: Date;
	days: number;
}

export function calcVipDays(payHistory: PurchaseRecord[]): number {
	if (!payHistory.length) {
		return 0;
	}
	// 首先按照购买记录的时间先后排序
	const sortedHistory = payHistory.sort((a, b) => a.date.getTime() - b.date.getTime());

	// 计算当前日期
	const currentDate = new Date();

	// 初始化剩余 VIP 天数为 0
	let remainingVipDays = 0;

	// 遍历购买记录
	for (const record of sortedHistory) {
		const { date, days } = record;

		// 如果购买日期在当前日期之前，则增加剩余 VIP 天数
		if (date <= currentDate) {
			remainingVipDays += days;
		} else {
			// 如果购买日期在当前日期之后，停止遍历
			break;
		}
	}

	return remainingVipDays;
}
