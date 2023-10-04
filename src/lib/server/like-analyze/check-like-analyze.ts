import { z } from 'zod';
import { token } from '../login/token';
import { prisma } from '../middlewares/prisma';
import { zodAuth } from '../zods';

export const zodCheckLikeAnalyzeInput = z.object({
	auth: zodAuth,
	analyzeId: z.number(),
});
export type CheckLikeAnalyzeInput = z.infer<typeof zodCheckLikeAnalyzeInput>;
export type CheckLikeAnalyzeOutput = ReturnType<typeof checkLikeAnalyze>;

export async function checkLikeAnalyze(input: CheckLikeAnalyzeInput) {
	const user = await token(input.auth);
	const old = await prisma.likeAnalyze.findFirst({
		where: {
			analyzeId: input.analyzeId,
			userId: user.id,
		},
	});
	return old;
}
