import { catcher } from '$lib/helpers/catcher';
import { test } from 'bun:test';
import { tddLogin } from '../login/login.test';
import { sentence } from './sentence';

export const tddSentence = async (auth: { email: string; token: string }) => {
	const res = await catcher(
		sentence({
			learn: 'en',
			local: 'zh',
			auth: auth,
			difficulty: 0.3,
			memorization: 0.4,
			translate: 'bbb',
			sentence: 'Watching English movies with subtitles helps me a lot.',
		}),
	);

	if ('rejected' in res) {
		throw new Error('test: sentence need success' + res.message);
	}
	return res;
};

test('sentence', async () => {
	const user = await tddLogin();

	await tddSentence(user.auth);
}, 90000);
