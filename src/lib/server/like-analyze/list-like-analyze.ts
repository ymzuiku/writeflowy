import { z } from 'zod';
import { token } from '../login/token';
import { prisma } from '../middlewares/prisma';
import { zodAuth } from '../zods';

export const zodListLikeAnalyzeInput = z.object({
	auth: zodAuth,
	offset: z.number(),
	limit: z.number(),
});
export type ListLikeAnalyzeInput = z.infer<typeof zodListLikeAnalyzeInput>;
export type ListLikeAnalyzeOutput = ReturnType<typeof listLikeAnalyze>;

export async function listLikeAnalyze(input: ListLikeAnalyzeInput) {
	const user = await token(input.auth);
	const list = await prisma.likeAnalyze.findMany({
		where: {
			userId: user.id,
		},
		skip: input.offset,
		take: input.limit,
	});
	return list;
}
