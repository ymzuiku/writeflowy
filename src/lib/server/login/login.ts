import { hashPassword, verifyPassword } from '$lib/helpers/hash-password';
import { i18nKey } from '$lib/i18n';
import { z } from 'zod';
import { DAY_7_FROM_SECOND, LOGIN_TOKEN } from '../constants';
import { prisma } from '../middlewares/prisma';
import { redisx } from '../middlewares/redisx';

export const zodLoginInput = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});
export type LoginInput = z.infer<typeof zodLoginInput>;
export type LoginOutput = ReturnType<typeof login>;

export async function login(input: LoginInput) {
	const user = await prisma.user.findFirst({ where: { email: input.email } });
	if (!user || !verifyPassword(input.password, user.password)) {
		throw new Error(i18nKey('邮箱或密码不正确'));
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password, ...out } = user;
	const old = await redisx.get(LOGIN_TOKEN + input.email);
	if (old) {
		out.token = JSON.parse(old).token;
	} else {
		out.token = hashPassword(Date.now() + '');
	}
	await redisx.setEx(LOGIN_TOKEN + input.email, DAY_7_FROM_SECOND, JSON.stringify(out));
	return out;
}
