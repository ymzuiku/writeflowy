import { hashPassword } from '$lib/helpers/hash-password';
import { i18nKey } from '$lib/i18n';
import type { Analyze } from '@prisma/client';
import { z } from 'zod';
import { AWS_S3_SENTENCES } from '../constants';
import { token } from '../login/token';
import { openaiChat } from '../middlewares/openai';
import { prisma } from '../middlewares/prisma';
import { s3 } from '../middlewares/s3';
import { getVipDays } from '../order/get-vip-days';
import { parseJsonText } from '../parse-json-text';
import { zodAuth, zodLearn } from '../zods';
import { searchImage } from './search-image';

export const zodAnalyzeInput = z.object({
	auth: zodAuth,
	analyzeId: z.number().optional(),
	text: z.string().max(5000),
	type: z.enum(['paragraph', 'scene', 'movie']),
	lastSentences: z.array(z.any()).optional(),
	learn: zodLearn,
});
export type AnalyzeInput = z.infer<typeof zodAnalyzeInput>;
export type AnalyzeOutput = ReturnType<typeof analyze>;

function parseMessage(
	text: string,
	type: 'paragraph' | 'scene' | 'movie',
	userText: string,
): string {
	if (type === 'paragraph') {
		return `接下里我需要你运用 5 种语言的知识进行分析，分别是：en 英文， zh 中文，es 西班牙语，jp 日语，fr 法语。你是精通这 5 种语言学习智能机器人， 并且非常善于以 JSON 的格式回答问题，请帮我分析下面这个段落，把里面的句子都拆分成好学习，好朗读的句子，如果一个句子太长导致不好记忆，应该拆分成两个。 并且根据为每个句子的难易层度打分，0～1， 1 分属于非常难，0 分属于入门英语，还有为每个句子的建议背诵的层度打分，并且对每个句子都应该要有 5 种语言，每个句子只需要有说话的内容，不需要有 xxx: , 然后再给这段话取一个 5 个语言的标题，分别是英文标题 enTitle， 中文标题 zhTitle, 日语标题 jpTitle, 西班牙语标题 esTitle，法语标题 frTitle，并且以纯 数组的方式回答，请直接返回 数组。
    下面是你返回的一个例子： 
    {
			"sentences": [
				{"en": "Hi there, my name is John.", "zh": "你好，我叫约翰。", "jp": "こんにちは、私の名前はジョンです。", "es": "Hola, mi nombre es John.", "fr":"Bonjour je m'appelle John.", "difficulty": 0.1, "memorization": 0.3  },
				{"en": "Can you tell me more about your?", "zh": "你能告诉我更多关于你的事吗？", "jp": "あなたのことについて詳しく教えてもらえますか？", "es": "¿Puedes contarme más sobre tu?", "fr":"Pouvez-vous m'en dire plus sur votre ?", "difficulty": 0.3, "memorization": 0.7 },
				],
				"enTitle": "<The title of this conversation>",
				"zhTitle": "<本次对话的标题>",
				"jpTitle": "<この会話のタイトル>",
				"esTitle": "<El título de esta conversación.>",
				"frTitle": "<Le titre de cette conversation>"
		}
    下面是需要你分析的段落：
    ${text}
    `;
	}
	if (type === 'scene') {
		return `我需要你运用 5 种语言的知识进行分析，分别是：en 英文， zh 中文，es 西班牙语，jp 日语，fr 法语。你是精通这 5 种语言学习智能机器人， 并且非常善于以 JSON 的格式回答问题，请根据我提供给你的场景，根据这类场景的对话分析出必须掌握的句子, 句子的每个语言都要非常地道，在英文或其他语言中，能用连词的就要尽量用连词，就和母语的人述说的一样，把里面的句子都拆分成好学习的口语句子, 并且根据为每个句子的难易层度打分，0～1， 1 分属于非常难，0 分属于入门英语，还有为每个句子的建议背诵的层度打分，并且对每个句子都应该要有 5 种语言，每个句子只需要有说话的内容，不需要有 xxx: , 然后再给这段话取一个 5 个语言的标题，分别是英文标题 enTitle， 中文标题 zhTitle, 日语标题 jpTitle, 西班牙语标题 esTitle，法语标题 frTitle，并且以纯 数组的方式回答，请直接返回 数组。你返回的句子应该不小于 10 个。
		如果场景中的内容涉及到我的个人信息，这里是关于我的信息：${userText}
		
    下面是你返回的一个例子： 
    {
			"sentences": [
				{"en": "Hi there, my name is John.", "zh": "你好，我叫约翰。", "jp": "こんにちは、私の名前はジョンです。", "es": "Hola, mi nombre es John.", "fr":"Bonjour je m'appelle John.", "difficulty": 0.1, "memorization": 0.3  },
				{"en": "Can you tell me more about your?", "zh": "你能告诉我更多关于你的事吗？", "jp": "あなたのことについて詳しく教えてもらえますか？", "es": "¿Puedes contarme más sobre tu?", "fr":"Pouvez-vous m'en dire plus sur votre ?", "difficulty": 0.3, "memorization": 0.7 },
				],
				"enTitle": "<The title of this conversation>",
				"zhTitle": "<本次对话的标题>",
				"jpTitle": "<この会話のタイトル>",
				"esTitle": "<El título de esta conversación.>",
				"frTitle": "<Le titre de cette conversation>"
		}
		
    下面是需要你分析的场景：
    ${text}
    `;
	}
	return '';
}

export interface Sentence {
	en: string;
	jp: string;
	zh: string;
	es: string;
	fr: string;
	difficulty: number;
	memorization: number;
	loading?: boolean;
}

export type AnalyzeClient = {
	id: number;
	created: Date;
	updated: Date;
	enTitle: string;
	zhTitle: string;
	jpTitle: string;
	esTitle: string;
	frTitle: string;
	image: string | null;
	imageUserUrl: string | null;
	answer: Sentence[];
};

export async function analyze(input: AnalyzeInput): Promise<AnalyzeClient> {
	const user = await token(input.auth);
	const vips = await getVipDays(input.auth);

	input.text = input.text.trim();

	const userText = JSON.stringify({
		name: user.name,
		address: user.address,
		current_company: user.current_company,
		desired_company: user.desired_company,
		education: user.education,
		email: user.email,
		occupation: user.occupation,
		personal_intro: user.personal_intro,
		skills: user.skills,
		target_position: user.target_position,
		years_of_experience: user.years_of_experience,
	});
	if (input.analyzeId) {
		const old = await prisma.analyze.findFirst({
			where: {
				id: input.analyzeId,
			},
		});

		if (!old) {
			throw i18nKey('未找到历史分析信息');
		}
		if (!old.hashQuestion) {
			throw i18nKey('历史hash未找到');
		}
		try {
			const answer = await s3
				.getObject({ Bucket: AWS_S3_SENTENCES, Key: old.hashQuestion! })
				.promise();
			if (!answer.Body) {
				throw i18nKey('未找到历史分析信息');
			}
			return {
				...old,
				answer: JSON.parse(String(answer.Body)),
			} as unknown as AnalyzeClient;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			if (err?.message?.indexOf('specified key does') > 0) {
				await prisma.analyze.delete({
					where: {
						id: old.id,
					},
				});
				throw i18nKey('未找到历史分析信息');
			}
			throw err;
		}
	}
	const hash = hashPassword(input.text);
	if (!input.lastSentences) {
		const old = await prisma.analyze.findFirst({
			where: {
				hashQuestion: hash,
				type: input.type,
			},
		});
		if (old) {
			if (!old.hashQuestion) {
				throw i18nKey('历史hash未找到');
			}
			try {
				const answer = await s3
					.getObject({ Bucket: AWS_S3_SENTENCES, Key: old.hashQuestion! })
					.promise();
				if (!answer.Body) {
					throw i18nKey('未找到历史分析信息');
				}
				return {
					...old,
					answer: JSON.parse(String(answer.Body)),
				} as unknown as AnalyzeClient;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				if (err?.message?.indexOf('specified key does') > 0) {
					await prisma.analyze.delete({
						where: {
							id: old.id,
						},
					});
					throw i18nKey('未找到历史分析信息');
				}
				throw err;
			}
		}
	}

	if (!vips.vip) {
		throw new Error(i18nKey('您的VIP或试用已过期，请在设置页面订阅再使用'));
	}

	const stream = await openaiChat({
		messages: [
			{
				role: 'user',
				content: parseMessage(input.text, input.type, userText),
			},
			...(input.lastSentences
				? ([
						{
							role: 'assistant',
							content: JSON.stringify(input.lastSentences),
						},
						{
							role: 'user',
							content: 'more',
						},
				  ] as const)
				: []),
		],
		model: 'gpt-3.5-turbo-16k-0613',
	});

	const obj = parseJsonText(stream.choices[0].message.content || '') as {
		enTitle: string;
		zhTitle: string;
		jpTitle: string;
		esTitle: string;
		frTitle: string;
		sentences: Sentence[];
	};

	let analyze: Analyze;
	let answer = [];
	if (!input.lastSentences) {
		const img = await searchImage(obj.enTitle);

		analyze = await prisma.analyze.create({
			data: {
				hashQuestion: hash,
				enTitle: obj.enTitle,
				zhTitle: obj.zhTitle,
				jpTitle: obj.jpTitle,
				esTitle: obj.esTitle,
				frTitle: obj.frTitle,
				creatorId: user.id,
				image: img?.image,
				imageUserUrl: img?.imageUserUrl,
				// imageUserUrl: img ? img.imageUserUrl : void 0,
			},
		});
		answer = obj.sentences;
		await s3
			.upload({
				Bucket: AWS_S3_SENTENCES,
				Key: hash,
				Body: JSON.stringify(answer),
			})
			.promise();
	} else {
		const old = await prisma.analyze.findFirst({
			where: {
				hashQuestion: hash,
			},
		});
		if (!old) {
			throw new Error(i18nKey('更新分析失败'));
		}
		analyze = await prisma.analyze.update({
			where: {
				id: old.id,
			},
			data: {
				enTitle: obj.enTitle,
				zhTitle: obj.zhTitle,
				jpTitle: obj.jpTitle,
				esTitle: obj.esTitle,
				frTitle: obj.frTitle,
				type: input.type,
				learn: input.learn,
			},
		});
		answer = [...input.lastSentences, ...obj.sentences];
		await s3
			.upload({
				Bucket: AWS_S3_SENTENCES,
				Key: hash,
				Body: JSON.stringify(answer),
			})
			.promise();
	}
	return {
		...analyze,
		answer,
	} as unknown as AnalyzeClient;
}
