import { expect, it } from 'bun:test';
import { randomCode } from './random-code';

it('randomCode 4', () => {
	const v = randomCode(4);
	expect(v.length).toBe(4);
});

it('randomCode 6', () => {
	const v = randomCode(6);
	expect(v.length).toBe(6);
});
