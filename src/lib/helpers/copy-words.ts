import { clipboardWrite } from './clipboard';
import { toastSuccess } from './toast';

function splitSentenceIntoWords(sentence: string): string[] {
	// 去掉标点符号，将句子中的字母数字字符和空格保留
	const sanitizedSentence = sentence.replace(/[^\w\s]/g, '');
	// 使用正则表达式匹配句子中的单词，\w+ 匹配一个或多个字母数字字符
	const words: string[] = sanitizedSentence.match(/\w+/g) || [];
	return words.filter((v) => v.length > 3);
}

export function copyWords(text?: string) {
	if (!text) {
		return;
	}
	const list = splitSentenceIntoWords(text).join(', ');
	clipboardWrite(list);
	toastSuccess(`Copy to clipboard: ${list}`);
}
