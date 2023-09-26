// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJsonText(jsonString: string): Record<string, any> | null {
	let openBraceIndex = -1;
	let closeBraceIndex = -1;

	for (let i = 0; i < jsonString.length; i++) {
		if (jsonString[i] === '{' && openBraceIndex === -1) {
			openBraceIndex = i;
		} else if (jsonString[i] === '}') {
			closeBraceIndex = i;
		}
	}

	if (openBraceIndex !== -1 && closeBraceIndex !== -1) {
		const extractedJsonString = jsonString.slice(openBraceIndex, closeBraceIndex + 1);
		try {
			const extractedJson = JSON.parse(extractedJsonString);
			return extractedJson;
		} catch (error) {
			return null;
		}
	} else {
		return null;
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseArrayText(jsonString: string): any[] | null {
	let openBraceIndex = -1;
	let closeBraceIndex = -1;

	for (let i = 0; i < jsonString.length; i++) {
		if (jsonString[i] === '[' && openBraceIndex === -1) {
			openBraceIndex = i;
		} else if (jsonString[i] === ']') {
			closeBraceIndex = i;
		}
	}

	if (openBraceIndex !== -1 && closeBraceIndex !== -1) {
		const extractedJsonString = jsonString.slice(openBraceIndex, closeBraceIndex + 1);
		try {
			const extractedJson = JSON.parse(extractedJsonString);
			return extractedJson;
		} catch (error) {
			return null;
		}
	} else {
		return null;
	}
}
