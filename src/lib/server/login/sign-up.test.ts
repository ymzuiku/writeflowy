import { expect, test } from 'bun:test';

import { catcher } from '$lib/helpers/catcher';
import { randomCode } from '$lib/helpers/random-code';
import { faker } from '@faker-js/faker';
import { DEV } from '../constants';
import { sendSignUpEmail } from './send-sign-up-email';
import { signUp } from './sign-up';

export async function tddSignIn() {
	const email = faker.internet.email();
	const code = randomCode(6, DEV);
	const password = faker.internet.password();

	const res1 = await catcher(sendSignUpEmail({ email }));
	expect(res1.message).toBe('已发送邮件');

	const res2 = await catcher(signUp({ email, code, password, local: 'zh' }));
	expect(res2.message).toBe('注册成功');
	return { email, code, password };
}

test('sign-up success', tddSignIn);

test('sign-up check more', async () => {
	const email = faker.internet.email();
	const code = randomCode(6, DEV);
	const password = faker.internet.password();
	const res1 = await catcher(signUp({ email, code, password, local: 'zh' }));
	expect(res1.message).toBe('你的验证码不正确');
	const res2 = await catcher(sendSignUpEmail({ email }));
	expect(res2.message).toBe('已发送邮件');
	const res3 = await catcher(sendSignUpEmail({ email }));
	expect(res3.message).toBe('你刚刚已发送过邮件，请查收邮箱');
	const res4 = await catcher(signUp({ email, code, password, local: 'zh' }));
	expect(res4.message).toBe('注册成功');
	const res5 = await catcher(signUp({ email, code, password, local: 'zh' }));
	expect(res5.message).toBe('你的验证码不正确');
	const res6 = await catcher(sendSignUpEmail({ email }));
	expect(res6.message).toBe('已发送邮件');
	const res7 = await catcher(signUp({ email, code, password, local: 'zh' }));
	expect(res7.message).toBe('该邮件已注册');
});
