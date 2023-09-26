import { createHmac } from 'node:crypto';

export function sha256(str: string) {
	return createHmac('sha256', '').update(str).digest('hex');
}

export function hashPassword(password: string) {
	return sha256(password);
}

export function verifyPassword(password: string, hash: string) {
	return sha256(password) === hash;
}
