export const clipboardWrite = async (text: string): Promise<boolean> => {
	if (typeof navigator === 'undefined') {
		return false;
	}
	if (location.href.indexOf('https') < 0) {
		console.warn('clipboard need https:', text);
		return false;
	}
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch (err) {
		//
		return false;
	}
};

export const clipboardRead = async (): Promise<string> => {
	if (typeof navigator === 'undefined') {
		return '';
	}
	if (location.href.indexOf('https') < 0) {
		console.warn('clipboard need https');
		return '';
	}
	try {
		const str = await navigator.clipboard.readText();
		return str;
	} catch (err) {
		return '';
	}
};
