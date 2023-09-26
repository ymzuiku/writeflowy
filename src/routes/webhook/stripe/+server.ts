/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { calcThisMonthDays } from '$lib/helpers/calc-this-month-days.js';
import { GETVIPDAYS } from '$lib/server/constants.js';
import { prisma } from '$lib/server/middlewares/prisma.js';
import { redisx } from '$lib/server/middlewares/redisx.js';
import { WEBHOOK_SECRET, stripe, toBuffer } from '$lib/server/order/stripe.js';
import { error } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	// const body = await request.text();
	let event;

	try {
		const buff = await request.arrayBuffer();
		const body = toBuffer(buff);
		const sig = request.headers.get('stripe-signature') || '';
		event = await stripe.webhooks.constructEventAsync(body, sig, WEBHOOK_SECRET);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		console.error(err.message);
		throw error(400, `Webhook Error: ${err.message}`);
	}

	// Handle the event
	switch (event.type) {
		// case 'charge.refunded':
		// 	const chargeRefunded = event.data.object;
		// 	// Then define and call a function to handle the event charge.refunded
		// 	break;
		case 'invoice.payment_succeeded':
			const chargeSucceeded = event.data.object as any;
			const email = chargeSucceeded.customer_email;
			const amount = chargeSucceeded.amount_paid;
			const orderId = chargeSucceeded.id;
			const currency = chargeSucceeded.currency;
			const subscribId = chargeSucceeded.subscription;
			const address = JSON.stringify(chargeSucceeded.customer_address);
			const user = await prisma.user.findFirst({
				where: {
					email,
				},
			});
			if (!user) {
				throw error(400, `Webhook Error: Email no reister`);
			}
			const oldOrder = await prisma.order.findFirst({
				where: { orderId },
			});
			if (oldOrder) {
				throw error(400, `The order is paymented`);
			}
			try {
				await redisx.del(GETVIPDAYS + user.id);
				await prisma.order.create({
					data: {
						amount: Number(amount),
						currency,
						email,
						address,
						orderId,
						userId: user.id,
						subscribId,
						days: calcThisMonthDays() + 1,
					},
				});
			} catch (err: any) {
				console.error(err);
				throw error(500, err.message);
			}
			// Then define and call a function to handle the event charge.succeeded
			break;
		// ... handle other event types
		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	// Return a 200 response to acknowledge receipt of the event
	return new Response(JSON.stringify({ message: 'Success' }));
};
