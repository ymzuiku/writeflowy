import { i18nKey } from '$lib/i18n';
import { z } from 'zod';
import { token } from '../login/token';
import { prisma } from '../middlewares/prisma';
import { zodAuth } from '../zods';
import { updateAgo } from './memorys';

export const zodUpdateMemoryInput = z.object({
	auth: zodAuth,
	memoryId: z.number(),
	memorability: z.number(),
});
export type UpdateMemoryInput = z.infer<typeof zodUpdateMemoryInput>;
export type UpdateMemoryOutput = ReturnType<typeof updateMemory>;

export async function updateMemory(input: UpdateMemoryInput) {
	const user = await token(input.auth);

	let res;
	try {
		res = await prisma.memory.update({
			where: {
				id: input.memoryId,
				userId: user.id,
				OR: updateAgo(),
			},
			data: {
				memorability: input.memorability,
			},
		});
	} catch (err) {
		throw new Error(i18nKey(`只能更新今天的需要记忆的句子`));
	}

	const next = await prisma.memory.findFirst({
		where: {
			memorability: {
				lt: res.memorability,
			},
			userId: user.id,
			learn: user.learn,
			local: user.local,
			OR: updateAgo(),
		},
		orderBy: [{ memorability: 'desc' }, { updated: 'asc' }],
	});
	return next;
}
