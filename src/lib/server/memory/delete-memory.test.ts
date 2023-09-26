import { expect, test } from 'bun:test';

import { tddLogin } from '../login/login.test';
import { tddSentence } from '../sentence/sentence.test';
import { deleteMemory } from './delete-memory';

test('delete memory', async () => {
	const user = await tddLogin();
	const sentence = await tddSentence(user.auth);
	const res = await deleteMemory({ auth: user.auth, memoryId: sentence.memoryId });
	expect(res.ok).toBe(1);
});
