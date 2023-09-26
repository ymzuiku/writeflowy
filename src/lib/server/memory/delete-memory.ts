import { z } from 'zod';
import { SUCCESS } from '../constants';
import { token } from '../login/token';
import { prisma } from '../middlewares/prisma';
import { zodAuth } from '../zods';

export const zodDeleteMemoryInput = z.object({
	auth: zodAuth,
	memoryId: z.number(),
	noFrist: z.boolean().optional(),
});
export type DeleteMemoryInput = z.infer<typeof zodDeleteMemoryInput>;
export type DeleteMemoryOutput = ReturnType<typeof deleteMemory>;

export async function deleteMemory(input: DeleteMemoryInput) {
	const user = await token(input.auth);
	await prisma.memory.delete({
		where: {
			id: input.memoryId,
			userId: user.id,
			memorability: input.noFrist ? 0 : void 0,
		},
	});
	return SUCCESS;
}
