import { OK, z } from 'zod';
import { token } from '../login/token';
import { prisma } from '../middlewares/prisma';
import { zodAuth } from '../zods';

export const zodAddLikeAnalyzeInput = z.object({
	auth: zodAuth,
	analyzeId: z.number(),
});
export type AddLikeAnalyzeInput = z.infer<typeof zodAddLikeAnalyzeInput>;
export type AddLikeAnalyzeOutput = ReturnType<typeof addLikeAnalyze>;

export async function addLikeAnalyze(input: AddLikeAnalyzeInput) {
	const user = await token(input.auth);

	await prisma.likeAnalyze.create({
		data: {
			userId: user.id,
			analyzeId: input.analyzeId,
		},
	});
	return OK;
}
