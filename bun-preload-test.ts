import { prisma } from '$lib/server/middlewares/prisma';
import { redisx } from '$lib/server/middlewares/redisx';
import { afterAll, afterEach, beforeAll, beforeEach } from 'bun:test';

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

beforeEach(async () => {
	try {
		await redisx.connect();
	} catch (err) {
		//
	}
});

afterEach(async () => {
	try {
		// if not disconnect at every test, test can't stop
		await Promise.resolve(redisx.disconnect());
	} catch (err) {
		//
	}
});
