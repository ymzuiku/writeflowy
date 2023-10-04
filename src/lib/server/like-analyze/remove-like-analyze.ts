import { OK, z } from 'zod';
import { token } from '../login/token';
import { prisma } from '../middlewares/prisma';
import { zodAuth } from '../zods';

export const zodRemoveLikeAnalyzeInput = z.object({
	auth: zodAuth,
	analyzeId: z.number(),
});
export type RemoveLikeAnalyzeInput = z.infer<typeof zodRemoveLikeAnalyzeInput>;
export type RemoveLikeAnalyzeOutput = ReturnType<typeof removeLikeAnalyze>;

export async function removeLikeAnalyze(input: RemoveLikeAnalyzeInput) {
	const user = await token(input.auth);
	await prisma.likeAnalyze.delete({
		where: {
			analyzeId_userId: {
				userId: user.id,
				analyzeId: input.analyzeId,
			},
		},
	});
	return OK;
}
