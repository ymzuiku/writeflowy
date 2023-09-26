import { calcVipDays } from '$lib/helpers/calc-vip-days';
import { DAY_ONE_FROM_SECOND, GETVIPDAYS } from '../constants';
import { token } from '../login/token';
import { prisma } from '../middlewares/prisma';
import { redisx } from '../middlewares/redisx';
import type { Auth } from '../zods';

export type GetVipOutput = ReturnType<typeof getVipDays>;

export async function getVipDays(
	input: Auth,
): Promise<{ days: number; vip: boolean; tryDays: number }> {
	const user = await token(input);
	const old = await redisx.get(GETVIPDAYS + user.id);
	if (old) {
		const out = JSON.parse(old);
		return out;
	}

	const timestampDiff = Math.abs(Date.now() - new Date(user.created).getTime());

	// 将时间戳差值转换为天数
	let tryDays = Math.ceil(timestampDiff / (1000 * 60 * 60 * 24));
	if (tryDays < 0) {
		tryDays = 0;
	}

	const threeMonthsAgo = new Date();
	threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
	const list = await prisma.order.findMany({
		where: {
			userId: user.id,
			created: {
				gte: threeMonthsAgo,
			},
		},
		take: 6,
	});
	const his = list.map((v) => {
		return { date: v.created, days: v.days };
	});
	const days = calcVipDays(his);
	const obj = {
		vip: days > 0 || tryDays < 8,
		days,
		tryDays,
	};

	await redisx.setEx(GETVIPDAYS + user.id, DAY_ONE_FROM_SECOND, JSON.stringify(obj));

	return obj;
}
