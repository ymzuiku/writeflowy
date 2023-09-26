import { i18nKey } from '$lib/i18n';
import { z } from 'zod';
import { token } from '../login/token';
import { openaiChat } from '../middlewares/openai';
import { prisma } from '../middlewares/prisma';
import { getVipDays } from '../order/get-vip-days';
import { parseJsonText } from '../parse-json-text';
import { zodAuth, zodLearn } from '../zods';
import { sentenceAIMessage } from './sentence-ai-message';

export const zodSentenceInput = z.object({
	auth: zodAuth,
	sentence: z.string(),
	difficulty: z.number(),
	memorization: z.number(),
	translate: z.string(),
	learn: zodLearn,
	local: zodLearn,
});
export type SentenceInput = z.infer<typeof zodSentenceInput>;
export type SentenceOutput = ReturnType<typeof sentence>;
export interface SentenceExplain {
	translate: string;
	split: Record<string, string>;
	step_by_step: Record<string, string>;
}

async function addMemory(
	userId: number,
	sentence: { text: string; learn: string; local: string; id: number; translate: string },
) {
	let old = await prisma.memory.findFirst({
		where: { userId, text: sentence.text, learn: sentence.learn, local: sentence.local },
	});
	if (!old) {
		old = await prisma.memory.create({
			data: {
				text: sentence.text,
				userId: userId,
				times: 0,
				translate: sentence.translate,
				learn: sentence.learn,
				local: sentence.local,
				sentenceId: sentence.id,
				memorability: 0,
			},
		});
	}
	return old;
}

export async function sentence(input: SentenceInput) {
	const user = await token(input.auth);
	const vips = await getVipDays(input.auth);

	if (!vips.vip) {
		throw new Error(i18nKey('您的VIP或试用已过期，请在设置页面订阅再使用'));
	}

	const oldSentence = await prisma.sentence.findFirst({
		where: { text: input.sentence, learn: input.learn, local: input.local },
	});
	if (oldSentence) {
		const memory = await addMemory(user.id, oldSentence);
		return { ...oldSentence, memoryId: memory.id };
	}
	const messages = [
		{
			role: 'user',
			content: sentenceAIMessage(input.learn, input.local, input.sentence),
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	] as any;

	const component = await openaiChat({
		messages,
		model: 'gpt-3.5-turbo-16k-0613',
		max_tokens: 14000,
		temperature: 1,
	});

	const res = parseJsonText(component.choices[0].message.content || '');
	if (!res || !res.translate || !res.split || !res.step_by_step) {
		throw new Error(i18nKey('句子分析失败'));
	}

	const sentence = await prisma.sentence.create({
		data: {
			learn: input.learn,
			local: input.local,
			text: input.sentence,
			translate: res.translate,
			difficulty: input.difficulty,
			memorization: input.memorization,
			explain: JSON.stringify(res),
		},
		select: {
			id: true,
			text: true,
		},
	});

	const memory = await addMemory(user.id, {
		id: sentence.id,
		text: sentence.text,
		translate: input.translate,
		learn: input.learn,
		local: input.local,
	});
	return { ...sentence, memoryId: memory.id };
}
