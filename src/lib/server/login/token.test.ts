import { catcher } from '$lib/helpers/catcher';
import { expect, test } from 'bun:test';
import { tddLogin } from './login.test';
import { token } from './token';

test('token success', async () => {
	const user = await tddLogin();

	const ok = await catcher(token({ email: user.email, token: user.token! }));
	expect('rejected' in ok).toBeFalse();
});

test('token rejected', async () => {
	const user = await tddLogin();

	{
		const res = await catcher(token({ email: user.email + '1', token: user.token! }));

		if (!('rejected' in res)) {
			throw new Error('test: need rejected');
		}
		expect(res.message).toBe('你的登录状态已过期');
	}

	{
		const res = await catcher(token({ email: user.email, token: user.token! + '1' }));

		if (!('rejected' in res)) {
			throw new Error('test: need rejected');
		}
		expect(res.message).toBe('你的登录状态已过期');
	}
});
