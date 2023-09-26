import { getSentence } from '$lib/server/sentence/get-sentence';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params }) => {
	const sentenceId = Number(params.sentenceId);
	if (!sentenceId) {
		return;
	}
	const res = await getSentence({ sentenceId: Number(params.sentenceId) });
	if (res) {
		return {
			...res,
			memorability: Number(params.memorability),
			memoryId: Number(params.memoryId),
		};
	}
};
