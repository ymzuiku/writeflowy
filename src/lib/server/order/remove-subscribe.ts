import { i18nKey } from '$lib/i18n';
import { z } from 'zod';
import { GETVIPDAYS } from '../constants';
import { token } from '../login/token';
import { prisma } from '../middlewares/prisma';
import { redisx } from '../middlewares/redisx';
import { zodAuth } from '../zods';
import { stripe } from './stripe';

export const zodRemoveSubscribInput = z.object({
	auth: zodAuth,
});
export type RemoveSubscribInput = z.infer<typeof zodRemoveSubscribInput>;
export type RemoveSubscribOutput = ReturnType<typeof removeSubscrib>;

export async function removeSubscrib(input: RemoveSubscribInput) {
	const user = await token(input.auth);
	const order = await prisma.order.findFirst({
		where: { userId: user.id },
		orderBy: { created: 'desc' },
	});
	if (!order) {
		throw new Error(i18nKey('没找到您的订阅'));
	}
	order.subscribId;
	await stripe.subscriptions.cancel(order.subscribId);

	await prisma.order.deleteMany({
		where: { userId: user.id, subscribId: order.subscribId },
	});
	await redisx.del(GETVIPDAYS + user.id);
	return { message: i18nKey('退订成功'), ok: 1 };
}
