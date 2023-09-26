import { i18nKey } from '$lib/i18n';
import type { User } from '@prisma/client';
import { z } from 'zod';
import { LOGIN_TOKEN } from '../constants';
import { redisx } from '../middlewares/redisx';

export const zodTokenInput = z.object({
	email: z.string().email(),
	token: z.string().min(24),
});
export type TokenInput = z.infer<typeof zodTokenInput>;
export type TokenOutput = ReturnType<typeof token>;

export async function token(input: TokenInput) {
	const userStr = await redisx.get(LOGIN_TOKEN + input.email);
	if (!userStr) {
		throw new Error(i18nKey('你的登录状态已过期'));
	}
	let user: User;
	try {
		user = JSON.parse(userStr);
	} catch (err) {
		throw new Error(i18nKey('token 解析失败'));
	}

	if (user.token !== input.token) {
		throw new Error(i18nKey('你的登录状态已过期'));
	}
	return user;
}
