import { z } from 'zod';
import { prisma } from '../middlewares/prisma';

export const zodCheckLoginInput = z.object({
	email: z.string().email(),
});
export type CheckLoginInput = z.infer<typeof zodCheckLoginInput>;
export type CheckLoginOutput = ReturnType<typeof checkLogin>;

export async function checkLogin(input: CheckLoginInput) {
	const user = await prisma.user.findFirst({
		where: {
			email: input.email,
		},
	});
	return { signUp: !!user };
}
