import { z } from 'zod';
import { prisma } from '../middlewares/prisma';
import { zodLearn } from '../zods';

export const zodGetAnalyzesInput = z.object({
	offset: z.number(),
	limit: z.number(),
	title: z.string().optional(),
	order: z.enum(['star', 'updated']),
	creatorId: z.number().optional(),
	learn: zodLearn,
});
export type GetAnalyzesInput = z.infer<typeof zodGetAnalyzesInput>;
export type GetAnalyzesOutput = ReturnType<typeof getAnalyzes>;

export async function getAnalyzes(input: GetAnalyzesInput) {
	const list = await prisma.analyze.findMany({
		where: {
			creatorId: input.creatorId ? input.creatorId : void 0,
			[input.learn + 'Title']: input.title
				? {
						contains: input.title,
				  }
				: void 0,
		},
		orderBy:
			input.order === 'star' ? [{ star: 'asc' }, { updated: 'desc' }] : [{ updated: 'desc' }],
		take: input.limit,
		skip: input.offset,
		select: {
			id: true,
			updated: true,
			image: true,
			star: true,
			enTitle: true,
			zhTitle: true,
			jpTitle: true,
			esTitle: true,
			frTitle: true,
		},
	});
	const count = await prisma.analyze.count({
		where: {
			creatorId: input.creatorId ? input.creatorId : void 0,
			[input.learn + 'Title']: input.title
				? {
						contains: input.title,
						mode: 'insensitive',
				  }
				: void 0,
		},
	});
	return { count, list };
}
