import { config } from 'dotenv';
import OpenAI from 'openai';
import type { RequestOptions } from 'openai/core';
import type {
	ChatCompletionCreateParamsNonStreaming,
	ChatCompletionCreateParamsStreaming,
} from 'openai/resources/chat';
export let openai: OpenAI;

config();
// type Model =
// 	| 'gpt-4'
// 	| 'gpt-4-0314'
// 	| 'gpt-4-0613'
// 	| 'gpt-4-32k'
// 	| 'gpt-4-32k-0314'
// 	| 'gpt-4-32k-0613'
// 	| 'gpt-3.5-turbo'
// 	| 'gpt-3.5-turbo-16k'
// 	| 'gpt-3.5-turbo-0301'
// 	| 'gpt-3.5-turbo-0613'
// 	| 'gpt-3.5-turbo-16k-0613';

export async function openaiChat(
	body: ChatCompletionCreateParamsNonStreaming,
	options?: RequestOptions,
) {
	if (!openai) {
		openai = new OpenAI({
			apiKey: process.env.OPENAI_CLIENT,
		});
	}
	try {
		const completion = await openai.chat.completions.create(body, options);
		return completion;
	} catch (err) {
		console.error('gpt error:', err);
		throw err;
	}
}

export async function openaiStream(
	body: ChatCompletionCreateParamsStreaming,
	options?: RequestOptions,
) {
	if (!openai) {
		openai = new OpenAI({
			apiKey: process.env.OPENAI_CLIENT,
		});
	}
	try {
		const completion = await openai.chat.completions.create(body, options);
		return completion;
	} catch (err) {
		console.error('gpt error:', err);
		throw err;
	}
}
