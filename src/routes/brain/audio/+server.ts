import { i18nKey } from '$lib/i18n';
import aws from 'aws-sdk';

let polly: aws.Polly;
// "arb"|"cmn-CN"|"cy-GB"|"da-DK"|"de-DE"|"en-AU"|"en-GB"|"en-GB-WLS"|"en-IN"|"en-US"|"es-ES"|"es-MX"|"es-US"|"fr-CA"|"fr-FR"|"is-IS"|"it-IT"|"ja-JP"|"hi-IN"|"ko-KR"|"nb-NO"|"nl-NL"|"pl-PL"|"pt-BR"|"pt-PT"|"ro-RO"|"ru-RU"|"sv-SE"|"tr-TR"|"en-NZ"|"en-ZA"|"ca-ES"|"de-AT"|"yue-CN"|"ar-AE"|"fi-FI"|"en-IE"|"nl-BE"|"fr-BE"
const lngCodeMap = {
	zh: 'cmn-CN',
	en: 'en-US',
	es: 'es-US',
	jp: 'ja-JP',
	fr: 'fr-FR',
};

export const GET = async ({ url, setHeaders }) => {
	if (!polly) {
		polly = new aws.Polly({
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: process.env.AWS_REGION2,
		});
	}

	const text = url.searchParams.get('text');
	const people = url.searchParams.get('people');
	const learn = url.searchParams.get('learn') || 'en';

	if (!text || !people) {
		throw new Error(i18nKey('缺少 text'));
	}
	const speechStream = await polly
		.synthesizeSpeech({
			OutputFormat: 'mp3',
			Text: text,
			VoiceId: people,
			LanguageCode: lngCodeMap[learn as 'en'],
			Engine: 'neural',
		})
		.promise();

	setHeaders({
		'content-type': 'audio/mp3',
	});

	if (!speechStream || !speechStream.AudioStream) {
		throw new Error('语音获取失败');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return new Response(speechStream.AudioStream as any, {
		headers: {
			'content-type': 'audio/mp3',
		},
	});
};
