import { z } from 'zod';
import { token } from '../login/token';
import { prisma } from '../middlewares/prisma';
import { zodAuth } from '../zods';

export const zodAddMemoryInput = z.object({
	auth: zodAuth,
	sentence: z.object({
		text: z.string(),
		learn: z.string(),
		local: z.string(),
		id: z.number(),
		translate: z.string(),
	}),
});
export type AddMemoryInput = z.infer<typeof zodAddMemoryInput>;
export type AddMemoryOutput = ReturnType<typeof addMemory>;

export async function addMemory(input: AddMemoryInput) {
	const user = await token(input.auth);
	let old = await prisma.memory.findFirst({
		where: {
			userId: user.id,
			text: input.sentence.text,
			learn: input.sentence.learn,
			local: input.sentence.local,
		},
	});
	if (!old) {
		old = await prisma.memory.create({
			data: {
				text: input.sentence.text,
				userId: user.id,
				times: 0,
				translate: input.sentence.translate,
				learn: input.sentence.learn,
				local: input.sentence.local,
				sentenceId: input.sentence.id,
				memorability: 0,
			},
		});
	}
	return old;
}
