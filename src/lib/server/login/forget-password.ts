import { hashPassword } from '$lib/helpers/hash-password';
import { i18nKey } from '$lib/i18n';
import { z } from 'zod';
import { LOGIN_TOKEN, SEND_FORGET_PASSWORD_EMAIL } from '../constants';
import { prisma } from '../middlewares/prisma';
import { redisx } from '../middlewares/redisx';

export const zodForgetPasswordInput = z.object({
	email: z.string().email(),
	code: z.string().length(6),
	password: z.string().min(6),
});
export type ForgetPasswordInput = z.infer<typeof zodForgetPasswordInput>;
export type ForgetPasswordOutput = ReturnType<typeof forgetPassword>;

export async function forgetPassword(input: ForgetPasswordInput) {
	const code = await redisx.get(SEND_FORGET_PASSWORD_EMAIL + input.email);
	if (input.code.length !== 6 || !code || code !== input.code) {
		throw new Error(i18nKey('你的验证码不正确'));
	}
	try {
		await prisma.user.update({
			where: {
				email: input.email,
			},
			data: {
				password: hashPassword(input.password),
			},
		});
	} catch (err) {
		throw new Error(i18nKey('账号未注册'));
	}

	await redisx.del(LOGIN_TOKEN + input.email);
	await redisx.del(SEND_FORGET_PASSWORD_EMAIL + input.email);
	return { message: i18nKey('密码修改成功'), ok: 1 };
}
