import { randomCode } from '$lib/helpers/random-code';
import { i18nKey } from '$lib/i18n';
import { z } from 'zod';
import { DEV, SEND_REGISTER_EMAIL } from '../constants';
import { emailx } from '../middlewares/emailx';
import { redisx } from '../middlewares/redisx';

export const zodSendSignUpEmailInput = z.object({
	email: z.string().email(),
});
export type SendSignUpEmailInput = z.infer<typeof zodSendSignUpEmailInput>;
export type SendSignUpEmailOutput = ReturnType<typeof sendSignUpEmail>;

export async function sendSignUpEmail(input: SendSignUpEmailInput) {
	const hasLastCode = await redisx.get(SEND_REGISTER_EMAIL + input.email);

	if (hasLastCode) {
		throw new Error(i18nKey('你刚刚已发送过邮件，请查收邮箱'));
	}
	const code = randomCode(6, DEV);
	if (!DEV) {
		const id = await emailx({
			email: input.email,
			text: `Your registration code: ${code}`,
			title: '(no reply) Writeflowy Register',
		});
		if (!id) {
			throw new Error(i18nKey('邮件发送失败，请稍后再试'));
		}
	}

	await redisx.setEx(SEND_REGISTER_EMAIL + input.email, DEV ? 10 * 1000 : 60 * 30 * 1000, code);
	return { message: i18nKey('已发送邮件'), ok: 1 };
}
