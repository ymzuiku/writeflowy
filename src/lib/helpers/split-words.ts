export function splitWords(sentence: string): string[] {
	// 使用正则表达式将句子分割成单词，\w+ 匹配一个或多个字母、数字或下划线
	const words = sentence.split(/\s+/);
	return words;
}
