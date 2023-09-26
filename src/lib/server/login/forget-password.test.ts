import { catcher } from '$lib/helpers/catcher';
import { expect, test } from 'bun:test';
import { forgetPassword } from './forget-password';
import { tddLogin } from './login.test';
import { sendForgtpasswordEmail } from './send-forget-password-email';

test('forget-password success', async () => {
	const account = await tddLogin();
	const res = await catcher(sendForgtpasswordEmail({ email: account.email }));
	if ('rejected' in res) {
		throw new Error('test: forget-password need success');
	}
	const res2 = await catcher(
		forgetPassword({ email: account.email, code: '999999', password: '123123b' }),
	);
	if ('rejected' in res2) {
		throw new Error('test: forget-password need success');
	}
	expect(res2.ok).toBe(1);
});
