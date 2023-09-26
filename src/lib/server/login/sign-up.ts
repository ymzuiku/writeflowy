import { hashPassword } from '$lib/helpers/hash-password';
import { i18nKey } from '$lib/i18n';
import { z } from 'zod';
import { SEND_REGISTER_EMAIL } from '../constants';
import { prisma } from '../middlewares/prisma';
import { redisx } from '../middlewares/redisx';
import { zodLearn } from '../zods';

export const zodSignUpInput = z.object({
	email: z.string().email(),
	code: z.string().length(6),
	password: z.string().min(6),
	local: zodLearn,
});
export type SignUpInput = z.infer<typeof zodSignUpInput>;
export type SignUpOutput = ReturnType<typeof signUp>;

export async function signUp(input: SignUpInput) {
	if (input.code.length !== 6) {
		throw new Error(i18nKey('你的验证码不正确'));
	}

	const code = await redisx.get(SEND_REGISTER_EMAIL + input.email);
	if (code !== input.code) {
		throw new Error(i18nKey('你的验证码不正确'));
	}
	try {
		await prisma.user.create({
			data: {
				email: input.email,
				learn: 'en',
				local: input.local,
				password: hashPassword(input.password),
				name: 'John Doe',
				occupation: 'Full stack Enginner',
				years_of_experience: 3,
				skills: 'JavaScript, React, Node.js, SQL',
				education: 'Bachelor of Science in Computer Science',
				address: '123 Main Street, LA, U.S.',
				target_position: 'Senior Software Engineer',
				current_company: 'TechCorp Inc.',
				desired_company: 'InnovateTech Solutions',
				personal_intro:
					'I am a passionate software engineer with a strong background in web development. I enjoy solving complex problems and building innovative solutions. My goal is to work with a forward-thinking company where I can contribute to exciting projects and continue to grow as a developer.',
			},
		});
	} catch (err) {
		if (err instanceof Error && /Unique/.test(err.message)) {
			throw new Error(i18nKey('该邮件已注册'));
		}
		throw err;
	}
	await redisx.del(SEND_REGISTER_EMAIL + input.email);
	return { message: i18nKey('注册成功'), ok: 1 };
}
