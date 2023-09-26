import { i18nKey } from '$lib/i18n';
import { z } from 'zod';
import { DAY_7_FROM_SECOND, LOGIN_TOKEN, SUCCESS } from '../constants';
import { token } from '../login/token';
import { prisma } from '../middlewares/prisma';
import { redisx } from '../middlewares/redisx';
import { zodAuth } from '../zods';

export const zodUpdateInfomationInput = z.object({
	auth: zodAuth,
	data: z.object({
		local: z.string().optional(),
		learn: z.string().optional(),
		name: z.string().optional(),
		occupation: z.string().optional(),
		years_of_experience: z.number().optional(),
		skills: z.string().optional(),
		education: z.string().optional(),
		address: z.string().optional(),
		target_position: z.string().optional(),
		current_company: z.string().optional(),
		desired_company: z.string().optional(),
		personal_intro: z.string().optional(),
	}),
});
export type UpdateInfomationInput = z.infer<typeof zodUpdateInfomationInput>;
export type UpdateInfomationOutput = ReturnType<typeof updateInfomation>;

export async function updateInfomation(input: UpdateInfomationInput) {
	const user = await token(input.auth);
	if (input.data.learn === user.local || input.data.local === user.learn) {
		throw new Error(i18nKey('学习目标和母语不能相同'));
	}
	const nextUser = await prisma.user.update({
		where: { email: input.auth.email },
		data: input.data,
	});

	const endUser = {
		...user,
		...nextUser,
		password: void 0,
		token: user.token,
	};

	await redisx.setEx(LOGIN_TOKEN + user.email, DAY_7_FROM_SECOND, JSON.stringify(endUser));
	return SUCCESS;
}
