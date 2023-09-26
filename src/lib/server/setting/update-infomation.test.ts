import { catcher } from '$lib/helpers/catcher';
import { expect, test } from 'bun:test';
import { login } from '../login/login';
import { tddLogin } from '../login/login.test';
import { updateInfomation } from './update-infomation';

test('update info mation', async () => {
	const user = await tddLogin();
	const res = await catcher(
		updateInfomation({
			auth: { email: user.email, token: user.token! },
			data: {
				name: 'dog',
			},
		}),
	);
	if ('rejected' in res) {
		throw new Error('test: udpate info mation need success');
	}
	const user2 = await login({ email: user.email, password: user.password });
	expect(user2.name).toBe('dog');
	expect(user2.education).toBe('Bachelor of Science in Computer Science');
});
