import { z } from 'zod';
import { token } from '../login/token';
import { prisma } from '../middlewares/prisma';
import { zodAuth } from '../zods';

export const zodMemorysInput = z.object({
	auth: zodAuth,
	offset: z.number(),
	limit: z.number().max(100),
	all: z.boolean(),
});
export type MemorysInput = z.infer<typeof zodMemorysInput>;
export type MemorysOutput = ReturnType<typeof memorys>;

function getDayAgo() {
	const twoHoursAgo = new Date();
	twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

	const oneDayAgo = new Date();
	oneDayAgo.setDate(oneDayAgo.getDate());

	const twoDayAgo = new Date();
	twoDayAgo.setDate(twoDayAgo.getDate() - 2);
	const threeDayAgo = new Date();
	threeDayAgo.setDate(threeDayAgo.getDate() - 3);
	const fiveDayAgo = new Date();
	fiveDayAgo.setDate(fiveDayAgo.getDate() - 5);
	const tenDayAgo = new Date();
	tenDayAgo.setDate(tenDayAgo.getDate() - 10);
	const fifteenDayAgo = new Date();
	fifteenDayAgo.setDate(fifteenDayAgo.getDate() - 15);
	const twentyDayAgo = new Date();
	twentyDayAgo.setDate(twentyDayAgo.getDate() - 21);
	return {
		twoHoursAgo,
		oneDayAgo,
		twoDayAgo,
		threeDayAgo,
		fiveDayAgo,
		tenDayAgo,
		fifteenDayAgo,
		twentyDayAgo,
	};
}

export function updateAgo() {
	const dayAgo = getDayAgo();
	return [
		{
			updated: {
				lt: dayAgo.twoHoursAgo,
			},
			memorability: {
				lt: 0.1,
			},
		},
		{
			updated: {
				lt: dayAgo.oneDayAgo,
			},
			memorability: {
				lt: 0.2,
			},
		},
		{
			updated: {
				lt: dayAgo.twoDayAgo,
			},
			memorability: {
				lt: 0.4,
			},
		},
		{
			updated: {
				lt: dayAgo.threeDayAgo,
			},
			memorability: {
				lt: 0.55,
			},
		},
		{
			updated: {
				lt: dayAgo.fiveDayAgo,
			},
			memorability: {
				lt: 0.65,
			},
		},
		{
			updated: {
				lt: dayAgo.tenDayAgo,
			},
			memorability: {
				lt: 0.75,
			},
		},
		{
			updated: {
				lt: dayAgo.fifteenDayAgo,
			},
			memorability: {
				lt: 0.85,
			},
		},
		{
			updated: {
				lt: dayAgo.twentyDayAgo,
			},
			memorability: {
				lt: 0.99,
			},
		},
	];
}

export async function memorys(input: MemorysInput) {
	const user = await token(input.auth);

	const list = await prisma.memory.findMany({
		where: {
			userId: user.id,
			learn: user.learn,
			local: user.local,
			OR: input.all ? void 0 : updateAgo(),
		},
		orderBy: [{ memorability: 'asc' }, { updated: 'asc' }],
		take: input.limit,
		skip: input.offset,
	});
	const count = await prisma.memory.count({
		where: {
			userId: user.id,
			learn: user.learn,
			local: user.local,
			OR: input.all ? void 0 : updateAgo(),
		},
	});

	return { count, list };
}
