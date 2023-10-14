export function splitSentences(text: string): string[] {
	// 使用正则表达式将文本分割成句子，句子以句号、问号或感叹号结尾
	const sentences = text.split(/(?<=[.!?])\s+/);
	return sentences;
}
