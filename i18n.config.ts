import { Database } from 'bun:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import OpenAI from 'openai';

const i18nIndex = `
/* eslint-disable @typescript-eslint/no-explicit-any */
import { i18nSource } from './i18n-source';

let lastLang = '';
const langs: Record<string, string> = { zh: 'zh', en: 'en', jp: 'jp', es: 'es', fr: 'fr' };
export const languageList = [
	{ value: 'en', label: 'English' },
	{ value: 'zh', label: '中文' },
	{ value: 'jp', label: '日本語' },
	{ value: 'es', label: 'Español' },
	{ value: '', label: 'Français' },
];
const nofound = {
	zh: ' ',
	en: ' ',
	jp: ' ',
	es: ' ',
	fr: ' ',
};
export const getLanguage = () => {
	if (typeof window === 'undefined') {
		return 'en';
	}
	if (lastLang) {
		return lastLang;
	}
	let lng = localStorage.getItem('lang');
	if (!lng) {
		lng = (navigator.language || navigator.language).slice(0, 2).toLowerCase();
	}

	lastLang = langs[lng] || 'en';
	return lastLang;
};

export function i18nKey(str: string): string {
	return str;
}

function template(strings: any, ...values: any): string {
	let result = '';
	for (let i = 0; i < strings.length; i++) {
		result += strings[i];
		if (i < values.length) {
			result += values[i];
		}
	}
	return result;
}

export function i18n(strings: any, ...values: any): string {
	const result = template(strings, values);
	return ((i18nSource as any)[result] || nofound)[getLanguage()];
}

export function i18nFromKey(key: string) {
	const obj = (i18nSource as any)[key];
	if (!obj) {
		return key;
	}
	return obj[getLanguage()];
}

export function i18nObj(strings: any, ...values: any): Record<string, string> {
	const result = template(strings, values);
	return (i18nSource as any)[result] || nofound;
}

export function setLanguage(lng: 'zh' | 'en' | 'jp' | 'es') {
	if (typeof window === 'undefined') {
		return;
	}
	lastLang = lng;
	localStorage.setItem('lang', lng);
	location.reload();
}

`;

const aiMessage = (text: string) => {
	return `请把我接下来的文本翻译成中文、英文、日文、西班牙文, 法语 记得首字母要大写
	比如：你好
	你的输出格式为 JSON： {zh:"你好", en:"Hello", jp:"こんにちは", es:"Hola", fr:"Français"}
	请不要有：好的，这是..., 或者：以下是... 这种回答的前缀，直接回答JSON即可
	记住请直接回答上面的 JSON 格式
	记住请直接回答上面的 JSON 格式
	记住请直接回答上面的 JSON 格式
	现在请你翻译：${text}`;
};

function parseJsonText(jsonString: string): Record<string, string> | null {
	let openBraceIndex = -1;
	let closeBraceIndex = -1;

	for (let i = 0; i < jsonString.length; i++) {
		if (jsonString[i] === '{' && openBraceIndex === -1) {
			openBraceIndex = i;
		} else if (jsonString[i] === '}') {
			closeBraceIndex = i;
		}
	}

	if (openBraceIndex !== -1 && closeBraceIndex !== -1) {
		const extractedJsonString = jsonString.slice(openBraceIndex, closeBraceIndex + 1);
		try {
			const extractedJson = JSON.parse(extractedJsonString);
			return extractedJson;
		} catch (error) {
			return null;
		}
	} else {
		return null;
	}
}

const openai = new OpenAI({
	apiKey: process.env.OPENAI_CLIENT,
});

const tableName = 'i18n';
const outdir = './src/lib/i18n';
const outfile = outdir + '/i18n-source.ts';
const outIndexFile = outdir + '/index.ts';
const typeRegx = /(\.svelte|\.ts)/;

// 递归遍历目录并查找匹配的文本
function findI18nTextInDirectory(dirPath: string, resultArray: string[]) {
	const files = fs.readdirSync(dirPath);

	files.forEach((file) => {
		const filePath = path.join(dirPath, file);

		if (fs.statSync(filePath).isDirectory()) {
			// 如果是目录，递归处理
			findI18nTextInDirectory(filePath, resultArray);
		} else {
			if (!typeRegx.test(filePath)) {
				return;
			}
			// 如果是文件，读取文件内容并查找匹配的文本
			const fileContent = fs.readFileSync(filePath, 'utf8');
			{
				const matches = fileContent.match(/(i18n|i18nObj)`[^`]+`/g);

				if (matches) {
					matches.forEach((match) => {
						// 提取匹配的文本，并去掉 i18n` 和 ` 符号
						const i18nText = match.replace(/(i18n|i18nObj)`|`/g, '');
						resultArray.push(i18nText);
					});
				}
			}
			{
				const matches = fileContent.match(/i18nKey\('([^']+)'\)/g);
				if (matches) {
					matches.forEach((match) => {
						const i18nText = match.replace(/i18nKey\('|'\)/g, '');
						resultArray.push(i18nText);
					});
				}
			}
			{
				const matches = fileContent.match(/i18nKey\("([^"]+)"\)/g);
				if (matches) {
					matches.forEach((match) => {
						const i18nText = match.replace(/i18nKey\("|"\)/g, '');
						resultArray.push(i18nText);
					});
				}
			}
			{
				const matches = fileContent.match(/i18nKey\(`([^`]+)`\)/g);
				if (matches) {
					matches.forEach((match) => {
						const i18nText = match.replace(/i18nKey\(`|`\)/g, '');
						resultArray.push(i18nText);
					});
				}
			}
		}
	});
}

async function insertKv(db: Database, k: string, v: string) {
	return db.query(`insert into ${tableName} (k, v) values ($k, $v)`).values({ $k: k, $v: v });
}

async function loadI18nTexts() {
	const texts: string[] = [];
	findI18nTextInDirectory('./src', texts);
	return Array.from(new Set(texts));
}

async function start(texts: string[]) {
	const db = new Database('i18n.sqlite', { create: true });
	await db
		.query(
			`
CREATE TABLE IF NOT Exists ${tableName} (
  k TEXT PRIMARY KEY,
  v TEXT
);
`,
		)
		.run();

	const out: Record<string, { zh: string; en: string; jp: string; es: string }> = {};
	for (const text of texts) {
		const old = (await db
			.query(`select * from ${tableName} where k = $text`)
			.get({ $text: text })) as {
			k: string;
			v: string;
		};

		if (!old) {
			console.log('tranlsate new:', text);
			const completion = await openai.chat.completions.create({
				messages: [{ role: 'user', content: aiMessage(text) }],
				model: 'gpt-3.5-turbo-0613',
			});
			const msg = completion.choices[0].message.content;
			try {
				if (!msg) {
					console.log('openai error, not msg:', text, msg);
					continue;
				}
				const obj = parseJsonText(msg);
				if (!obj) {
					throw new Error('openai parse error:' + msg);
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				out[text] = obj as any;
				await insertKv(db, text, JSON.stringify(out[text]));
			} catch (err) {
				console.log('openai error, parse error:', text, msg, err);
			}
		} else {
			// console.log('load by sqlite:', text);
			out[text] = JSON.parse(old.v);
		}
	}
	return out;
}

async function pipe() {
	const texts = await loadI18nTexts();
	const out = await start(texts);
	fs.writeFileSync(
		outfile,
		`
		export const i18nSource = ${JSON.stringify(out)}
	`,
	);
	fs.writeFileSync(outIndexFile, i18nIndex);
	console.log('Auto i18n sentences: ', Object.keys(out).length);
	Bun.spawnSync(['bunx', 'prettier', outdir, '--write']);
}

pipe();
