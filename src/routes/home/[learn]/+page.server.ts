import { getAnalyzes } from '$lib/server/sentence/get-analyzes';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return getAnalyzes({
		learn: params.learn as 'en',
		order: 'updated',
		offset: 0,
		limit: 10,
	});
};
