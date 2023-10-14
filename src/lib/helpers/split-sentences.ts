export function splitSentences(text: string): string[] {
	if (!text) {
		return [];
	}
	// 使用正则表达式将文本分割成句子，句子以句号、问号或感叹号结尾
	const sentences = text.split(/([.!?])\s+/).map((v) => v.trim());
	sentences.forEach((v, i) => {
		if ((v === '.' || v === '?' || v === '!') && sentences[i - 1]) {
			sentences[i - 1] += v;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			sentences[i] = void 0 as any;
		}
	});

	return sentences.filter(Boolean);
}
