import Stripe from 'stripe';
export const WEBHOOK_SECRET = process.env.SCRIPE_WEBHOOK_SECRET || '';
const SCRIPE_SECRET = process.env.SCRIPE_SECRET || '';
export const stripe = new Stripe(SCRIPE_SECRET, { apiVersion: '2023-08-16' });

export function toBuffer(ab: ArrayBuffer): Buffer {
	const buf = Buffer.alloc(ab.byteLength);
	const view = new Uint8Array(ab);
	for (let i = 0; i < buf.length; i++) {
		buf[i] = view[i];
	}
	return buf;
}
