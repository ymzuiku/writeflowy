import { z } from 'zod';
import { SUCCESS } from '../constants';
import { token } from '../login/token';
import { prisma } from '../middlewares/prisma';
import { zodAuth, zodLearn } from '../zods';

export const zodCreateMemorysInput = z.object({
	auth: zodAuth,
	type: z.string(),
	learn: zodLearn,
	local: zodLearn,
	sentences: z.array(
		z.object({
			sentenceId: z.number(),
			text: z.string(),
			difficulty: z.number(),
			memorization: z.number(),
		}),
	),
});

export type CreateMemorysInput = z.infer<typeof zodCreateMemorysInput>;
export type CreateMemorysOutput = ReturnType<typeof createMemorys>;

export async function createMemorys(input: CreateMemorysInput) {
	const user = await token(input.auth);
	for (const item of input.sentences) {
		try {
			await prisma.memory.create({
				data: {
					...item,
					userId: user.id,
					memorability: 0,
					times: 0,
					learn: input.learn,
					local: input.local,
				},
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			if ('code' in err && err.code === 'P2002') {
				//
			} else {
				throw err;
			}
		}
	}

	return SUCCESS;
}
