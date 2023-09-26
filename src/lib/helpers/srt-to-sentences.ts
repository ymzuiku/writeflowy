function removeHtmlTags(input: string) {
	return input.replace(/<\/?[^>]+(>|$)/g, '');
}

export function srtToSentences(srt: string) {
	let texts = srt.split('\n');
	texts = texts.filter((text) => {
		const v = text.trim();
		if (!v) {
			return false;
		}
		if (v.indexOf('-->') > -1) {
			return false;
		}
		if (!isNaN(Number(v))) {
			return false;
		}
		return true;
	});
	texts = texts.map(removeHtmlTags);
	texts = Array.from(new Set(texts));
	return texts;
}
