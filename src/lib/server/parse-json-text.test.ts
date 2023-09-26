import { expect, test } from 'bun:test';
import { parseArrayText, parseJsonText } from './parse-json-text';

const txt =
	'这是 你的结果 {\n\t"sentence":"What is a closure in JavaScript? Can you provide an example of its usage?",\n\t"translate": "JavaScript中的闭包是什么？你能提供一个它的使用示例吗？",\n\t"split": {\n\t\t"What is a closure in JavaScript?": "JavaScript中的闭包是什么？",\n\t\t"can you provide an example of its usage?": "你能提供一个它的使用示例吗？"\n\t},\n\t"step_by_step": {\n\t\t"What": "（什么）是疑问代词，引导一个问题",\n\t\t"is": "（是）是连系动词，用来连接主语和主语的补语，表示状态或性质",\n\t\t"a": "（一个）是不定冠词，用于限定后面的名词 closure（闭包）",\n\t\t"closure": "（闭包）是名词，指的是在JavaScript中的特定概念",\n\t\t"in": "（在）是介词，表示在某个语言或环境中",\n\t\t"JavaScript": "（JavaScript）是名词，表示一种编程语言",\n\t\t"can": "（能够）是情态动词，用来表示能力或允许性",\n\t\t"you": "（你）是主语，表示句子的动作是由这个人执行的",\n\t\t"provide": "（提供）是动词，表示提供或给出",\n\t\t"an": "（一个）是不定冠词，用于限定后面的名词 example（示例）",\n\t\t"example": "（示例）是名词，表示一个具体的实例",\n\t\t"of": "（的）是介词，表示属于或关于",\n\t\t"its": "（它的）是代词，指代前面提到的闭包",\n\t\t"usage": "（使用）是名词，表示对闭包的使用"\n\t}\n} \n 以上就是答案';

test('parse json in text', async () => {
	const res = parseJsonText(txt);
	expect(res?.sentence).toEqual(
		'What is a closure in JavaScript? Can you provide an example of its usage?',
	);
	expect(res?.step_by_step?.What).toBe('（什么）是疑问代词，引导一个问题');
});

const arr =
	'这是 你的结果 [{\n\t"sentence":"What is a closure in JavaScript? Can you provide an example of its usage?",\n\t"translate": "JavaScript中的闭包是什么？你能提供一个它的使用示例吗？",\n\t"split": {\n\t\t"What is a closure in JavaScript?": "JavaScript中的闭包是什么？",\n\t\t"can you provide an example of its usage?": "你能提供一个它的使用示例吗？"\n\t},\n\t"step_by_step": {\n\t\t"What": "（什么）是疑问代词，引导一个问题",\n\t\t"is": "（是）是连系动词，用来连接主语和主语的补语，表示状态或性质",\n\t\t"a": "（一个）是不定冠词，用于限定后面的名词 closure（闭包）",\n\t\t"closure": "（闭包）是名词，指的是在JavaScript中的特定概念",\n\t\t"in": "（在）是介词，表示在某个语言或环境中",\n\t\t"JavaScript": "（JavaScript）是名词，表示一种编程语言",\n\t\t"can": "（能够）是情态动词，用来表示能力或允许性",\n\t\t"you": "（你）是主语，表示句子的动作是由这个人执行的",\n\t\t"provide": "（提供）是动词，表示提供或给出",\n\t\t"an": "（一个）是不定冠词，用于限定后面的名词 example（示例）",\n\t\t"example": "（示例）是名词，表示一个具体的实例",\n\t\t"of": "（的）是介词，表示属于或关于",\n\t\t"its": "（它的）是代词，指代前面提到的闭包",\n\t\t"usage": "（使用）是名词，表示对闭包的使用"\n\t}\n}, {"dog":2}] \n 以上就是答案';

test('parse arr in text', async () => {
	const res = parseArrayText(arr);
	expect(res?.length).toEqual(2);
});
