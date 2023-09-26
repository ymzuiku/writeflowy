import { hashPassword } from '$lib/helpers/hash-password';
import { srtToSentences } from '$lib/helpers/srt-to-sentences';
import { i18nKey } from '$lib/i18n';
import { z } from 'zod';
import { AWS_S3_SENTENCES } from '../constants';
import { token } from '../login/token';
import { openaiChat } from '../middlewares/openai';
import { prisma } from '../middlewares/prisma';
import { s3 } from '../middlewares/s3';
import { parseJsonText } from '../parse-json-text';
import { zodAuth, zodLearn } from '../zods';
import type { AnalyzeClient } from './analyze';
import { searchImage } from './search-image';

export const zodAnalyzeMovieInput = z.object({
	auth: zodAuth,
	analyzeId: z.number().optional(),
	// movieTitle: z.string(),
	text: z.string().min(6).max(90000),
	learn: zodLearn,
});
export type AnalyzeMovieInput = z.infer<typeof zodAnalyzeMovieInput>;
export type AnalyzeMovieOutput = ReturnType<typeof analyzeMovie>;

function getMovieTitleMessage(text: string) {
	return `请你帮我分析一个电影的字幕片段，你帮我分析出它是那部电影，得到电影的名称，需要有英文名称(enTitle), 中文名称(zhTitle), 日文名称(jpTitle), 西班牙名称(esTitle)，法语名称(frTitle), 一共 5 种语言的名称， 你返回的格式应该是JSON 类型，类似这样: {"enTitle":"Movie title", "zhTitle": "电影标题", "jpTitle": "映画のタイトル'", "esTitle": "título de la película'", "frTitle": "titre du film'"}.
	你帮我分析一个电影的字幕片段是： ${text}`;
}

export async function analyzeMovie(input: AnalyzeMovieInput): Promise<AnalyzeClient> {
	const user = await token(input.auth);
	if (input.analyzeId) {
		const old = await prisma.analyze.findFirst({
			where: {
				id: input.analyzeId,
			},
		});
		if (!old) {
			throw i18nKey('未找到历史分析信息');
		}
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
	}
	const hash = hashPassword(input.text);
	if (input.text) {
		const old = await prisma.analyze.findFirst({
			where: {
				hashQuestion: hash,
				type: 'movie',
			},
		});

		if (old) {
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
		}
	}

	const list = srtToSentences(input.text).map((v) => {
		return {
			sentence: v,
			difficulty: v.length / 70 > 1 ? 1 : v.length / 70,
			memorization: v.length / 80 > 1 ? 1 : v.length / 80,
		};
	});

	const stream = await openaiChat({
		messages: [
			{
				role: 'user',
				content: getMovieTitleMessage(input.text.slice(0, 3000)),
			},
		],
		model: 'gpt-3.5-turbo-0613',
	});
	const obj = parseJsonText(stream.choices[0].message.content || '') as {
		entitle: string;
		zhTitle: string;
		jpTitle: string;
		esTitle: string;
		frTitle: string;
	};

	const img = await searchImage(obj.entitle);

	const analyze = await prisma.analyze.create({
		data: {
			hashQuestion: hash,
			enTitle: obj.entitle,
			zhTitle: obj.zhTitle,
			jpTitle: obj.jpTitle,
			esTitle: obj.esTitle,
			frTitle: obj.frTitle,
			creatorId: user.id,
			learn: input.learn,
			type: 'movie',
			image: img?.image,
			imageUserUrl: img?.imageUserUrl,
		},
	});

	await s3
		.upload({
			Bucket: AWS_S3_SENTENCES,
			Key: hash,
			Body: JSON.stringify(list),
		})
		.promise();
	return {
		...analyze,
		answer: list,
	} as unknown as AnalyzeClient;
}
