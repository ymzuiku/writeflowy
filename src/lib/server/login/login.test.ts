import { catcher } from '$lib/helpers/catcher';
import { expect, test } from 'bun:test';
import { login } from './login';
import { tddSignIn } from './sign-up.test';

export async function tddLogin() {
	const account = await tddSignIn();
	const res = await catcher(login({ email: account.email, password: account.password }));
	if ('message' in res) {
		throw new Error('test: need login success');
	}
	expect(res.email).toBe(account.email);
	expect(res.token!.length > 63).toBeTrue();
	return { ...res, password: account.password, auth: { email: res.email, token: res.token! } };
}

test('login success', tddLogin);

test('login fail', async () => {
	const account = await tddSignIn();
	{
		const res = await catcher(login({ email: account.email + '2', password: account.password }));
		if ('message' in res) {
			expect(res.message).toBe('邮箱或密码不正确');
		}
	}

	{
		const res = await catcher(login({ email: account.email, password: account.password + '2' }));
		if ('message' in res) {
			expect(res.message).toBe('邮箱或密码不正确');
		}
	}
});
