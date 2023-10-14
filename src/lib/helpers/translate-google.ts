function removePunctuation(inputString: string) {
	// eslint-disable-next-line no-useless-escape
	const regex = /[.,\/#!$%\^&\*;:{}=\-_`~()\[\]\p{P}]/gu;
	return inputString.replace(regex, '');
}

export async function translateGoogle(q: string, to: string) {
	if (typeof q !== 'string') {
		return '';
	}
	if (to === 'zh') {
		to = 'zh-CN';
	} else if (to === 'es') {
		to = 'es';
	} else if (to === 'jp') {
		to = 'ja';
	}
	q = removePunctuation(q);
	const uri = `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=auto&tl=${to}&q=${q}`;

	const res = await fetch(uri, { method: 'GET' }).then((v) => v.json());
	if (res[0] && res[0][0] && res[0][0][0]) {
		return res[0][0][0];
	}
	return 'Null';
}
