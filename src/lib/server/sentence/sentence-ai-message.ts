import type { Learn } from '../zods';

const base = `你是一个语法专家，请帮我翻译句子（translate），并且以更好朗读的方式把句子分成一小段一小段进行解释（split），并且一步步解释句子的每个词，每个词都要有音标(step_by_step)，标点符号不需要解释
假如需要你分析的句子是：
Can you tell me more about your front-end development experience?
你回答的格式应该如下, JSON：
{
  "translate": "你能告诉我更多关于你的前端开发经验和你曾使用过的技术吗？",
  "split": {
    "Can you tell me more about": "你能告诉我更多关于",
    "your front-end development experience": "你的前端开发经验"
  },
  "step_by_step": {
    "Can": "/kæn/（能够）是情态动词，用来表示能力或允许性",
    "you": "/ju/（你）是主语，表示句子的动作是由这个人执行的",
    "tell": "/tɛl/（告诉）是动词，表示动作的性质，即询问信息",
    "me": "/mi/（我）是间接宾语，表示动作的接收者是谁",
    "more": "/mɔr/（更多）是副词，修饰动词 tell，表示要求更多的信息",
    "about": "/əˈbaʊt/（关于）是介词，引导关于某事的更多信息",
    "your": "/jʊr/（你的）是形容词，修饰名词 experience（经验）和 technologies（技术），表示这些经验和技术属于对方。",
    "front-end": "/frʌnt ɛnd/（前端）是形容词，修饰 development（开发），表示这是与前端开发相关的经验和技术",
    "development": "/dɪˈvɛləpmənt/（开发）是名词，指的是动作的性质",
    "experience": "/ɪkˈspɪəriəns/（经验）是名词，表示前端开发的经验"
  }
}`;

const baseJP = `
あなたは文法の専門家です、文の翻訳を手伝ってください（translate），そして、文章を短い段落にまとめて、声に出して読みやすいように説明します。（split），文の各単語を段階的に説明します。各単語には発音記号が必要です(step_by_step)，句読点については説明の必要はありません
分析する必要がある文が次の場合:
Can you tell me more about your front-end development experience?
回答の形式は次のとおりです, JSON:
{
  "translate": "あなたは、あなたのフロントエンド開発経験と使用した技術についてもっと教えていただけますか？",
  "split": {
    "Can you tell me more about": "もっと教えていただけますか？",
    "your front-end development experience": "あなたのフロントエンド開発経験"
  },
  "step_by_step": {
    "Can": "/kæn/（できますか）は、能力や許可を表すモダル動詞です。",
    "you": "/ju/（あなた）は主語で、行動を実行する人を示します。",
    "tell": "/tɛl/（教えてください）は動詞で、情報を尋ねる行動を表します。",
    "me": "/mi/（私に）は間接目的語で、行動の受け手を示します。",
    "more": "/mɔr/（もっと）は副詞で、動詞「tell」を修飾し、より多くの情報を要求します。",
    "about": "/əˈbaʊt/（について）は前置詞で、特定のことに関する追加情報を導入します。",
    "your": "/jʊr/（あなたの）は形容詞で、名詞「experience」および「technologies」を修飾し、これらの経験と技術が相手に関連していることを示します。",
    "front-end": "/frʌnt ɛnd/（フロントエンド）は形容詞で、名詞「development」を修飾し、これはフロントエンド開発に関連する経験と技術であることを示します。",
    "development": "/dɪˈvɛləpmənt/（開発）は名詞で、行動の性質を指します。",
    "experience": "/ɪkˈspɪəriəns/（経験）は名詞で、フロントエンド開発の経験を示します。"
  }
}

`;

const baseEs = `Eres un experto en gramática, por favor ayúdame a traducir la oración.（translate），Y explique las oraciones en párrafos cortos de una manera que facilite la lectura en voz alta.（split），Y explica cada palabra de la oración paso a paso, cada palabra debe tener símbolos fonéticos.(step_by_step), Los signos de puntuación no necesitan explicación.
Si la frase que necesitas analizar es：
Can you tell me more about your front-end development experience and the technologies you've worked with?
El formato de su respuesta debe ser el siguiente, JSON：
{
  "translate": "¿Puedes contarme más acerca de tu experiencia en desarrollo de front-end y las tecnologías con las que has trabajado?",
  "split": {
    "Can you tell me more about": "¿Puedes contarme más acerca de",
    "your front-end development experience": "tu experiencia en desarrollo de front-end"
  },
  "step_by_step": {
    "Can": "/kæn/（Puedes）es un verbo modal que se utiliza para expresar capacidad o permiso.",
    "you": "/ju/（tú）es el sujeto y representa a la persona que realiza la acción en la oración.",
    "tell": "/tɛl/（contarme）es un verbo que describe la naturaleza de la acción, en este caso, pedir información.",
    "me": "/mi/（me）es un objeto indirecto que indica quién recibe la acción.",
    "more": "/mɔr/（más）es un adverbio que modifica al verbo 'tell' y significa solicitar información adicional.",
    "about": "/əˈbaʊt/（acerca de）es una preposición que introduce información adicional sobre algo.",
    "your": "/jʊr/（tu）es un adjetivo que modifica los sustantivos 'experiencia' y 'tecnologías', indicando que pertenecen a la persona a la que se dirige.",
    "front-end": "/frʌnt ɛnd/（desarrollo de front-end）es un adjetivo que modifica al sustantivo 'experiencia', indicando que se trata de experiencia relacionada con el desarrollo de front-end.",
    "development": "/dɪˈvɛləpmənt/（desarrollo）es un sustantivo que se refiere a la naturaleza de la acción.",
    "experience": "/ɪkˈspɪəriəns/（experiencia）es un sustantivo que indica la experiencia en desarrollo de front-end."
  }
}
`;

const baseEn = `Eres un experto en gramática, por favor ayúdame a traducir la oración.（translate），Y explique las oraciones en párrafos cortos de una manera que facilite la lectura en voz alta.（split），And explain each word of the sentence step by step, each word must have phonetic symbols(step_by_step), Punctuation marks need no explanation.
Si la frase que necesitas analizar es：
Can you tell me more about your front-end development experience and the technologies you've worked with?
El formato de su respuesta debe ser el siguiente, JSON：
{
  "translate": "你能告诉我更多关于你的前端开发经验吗？",
  "split": {
    "你能告诉我": "Can you tell me",
    "更多关于你的前端开发经验": "More about your front-end development experience"
  },
  "step_by_step": {
    "你": "[Nǐ] You",
    "能": "[Néng] Can",
    "告诉": "[Gàosù] Tell",
    "我": "[Wǒ] Me",
    "更多": "[Gèngduō] More",
    "关于": "[Guānyú] About",
    "你的": "[Nǐ de] Your",
    "前端": "[Qiánduān] Front-end。",
    "开发": "[Kāifā] Development",
    "经验": "[Jīngyàn] Experience"
  }
}
`;

const baseFr = `
ESi vous êtes un expert en grammaire, aidez-moi à traduire la phrase（translate），Et expliquez les phrases en paragraphes courts de manière à ce qu'elles soient faciles à lire à haute voix.（split），Et expliquez chaque mot de la phrase étape par étape, chaque mot doit avoir des symboles phonétiques(step_by_step), Les signes de ponctuation ne nécessitent aucune explication.
Si la phrase que vous devez analyser est：
Can you tell me more about your front-end development experience and the technologies you've worked with?
Le format de votre réponse doit être le suivant, JSON：
{
  "translate": "Tu es un experto en grammaire, s'il te plaît, aide-moi à traduire la phrase.",
  "split": {
    "Eres un experto en gramática": "Tu es un experto en grammaire",
    "por favor ayúdame a traducir la oración.": "s'il te plaît, aide-moi à traduire la phrase."
  },
  "step_by_step": {
    "Eres": "('Tu es') es una forma conjugada del verbo 'ser' en segunda persona del singular en presente de indicativo, indicando 'tú eres' en español.",
    "un": "('un') es un artículo indefinido en español, que se traduce como 'un' en francés.",
    "experto": "('experto') es un sustantivo en español que significa 'experto' y se traduce como 'expert' en francés.",
    "en": "('en') es una preposición en español que se traduce como 'en' en francés.",
    "gramática": "('grammaire') es un sustantivo en español que significa 'gramática' y se traduce como 'grammaire' en francés.",
    "por favor": "('s'il te plaît') es una expresión en español que significa 'por favor' y se traduce como 's'il te plaît' en francés.",
    "ayúdame": "('aide-moi') es una forma conjugada del verbo 'ayudar' en español, que significa 'ayúdame' en francés.",
    "a": "('à') es una preposición en español que se traduce como 'à' en francés.",
    "traducir": "('traduire') es un verbo en español que significa 'traducir' y se traduce como 'traduire' en francés.",
    "la": "('la') es un artículo definido en español que se traduce como 'la' en francés.",
    "oración": "('phrase') es un sustantivo en español que significa 'oración' y se traduce como 'phrase' en francés."
  }
}
`;

const languageText = {
	en: '英语',
	zh: '中文',
	jp: '日语',
	es: '西班牙语',
	fr: '法语',
};

export function sentenceAIMessage(learn: Learn, local: Learn, sentence: string) {
	if (local === 'zh') {
		return `${base}
下面是需要你分析的句子：
    ${sentence}
            `.trim();
	}

	if (local === 'en') {
		return `${baseEn}
Answers are in English!
Answers are in English!
Answers are in English!
The next sentences you need to analyze:
${sentence}
            `.trim();
	}

	if (local === 'fr') {
		return `${baseFr}
Veuillez utiliser le français lorsque vous répondez aux questions!
Veuillez utiliser le français lorsque vous répondez aux questions!
Veuillez utiliser le français lorsque vous répondez aux questions!
Les phrases suivantes nécessitent votre analyse:
${sentence}
            `.trim();
	}

	if (local === 'jp') {
		return `${baseJP}
解答の説明部分は中国語ではなく日本語で説明してください！
解答の説明部分は中国語ではなく日本語で説明してください！
解答の説明部分は中国語ではなく日本語で説明してください！
次の文は分析が必要です:
${sentence}
            `.trim();
	}

	if (local === 'es') {
		return `${baseEs}
Las respuestas están en español.
Las respuestas están en español.
Las respuestas están en español.
Las siguientes oraciones que necesitas analizar:
${sentence}
    `;
	}

	return `${base}
上面我说的是母语是中文的人学英语的例子，接下来的句子是母语是${languageText[local]}的人学${languageText[learn]}，
之后你回答的解释部分请用${languageText[local]}，记得，这很重要，解释的部分请用${languageText[local]}, 而不是中文。
下面是需要你分析的句子是${languageText[learn]}：
${sentence}
        `.trim();
}
