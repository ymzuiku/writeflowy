import { i18nKey } from '$lib/i18n';
import { z } from 'zod';
import { prisma } from '../middlewares/prisma';

export const zodGetSentenceInput = z.object({
	sentenceId: z.number(),
});

export type GetSentenceInput = z.infer<typeof zodGetSentenceInput>;
export type GetSentenceOutput = ReturnType<typeof getSentence>;

export async function getSentence(input: GetSentenceInput) {
	if (!input.sentenceId) {
		throw new Error(i18nKey(`缺少 Sentence ID`));
	}
	return prisma.sentence.findFirst({
		where: {
			id: input.sentenceId,
		},
	});
}
