import { prisma } from '$lib/server/middlewares/prisma';

export async function load() {
	const user = await prisma.user.count();
	const order = await prisma.order.count();
	return { user, order };
}
