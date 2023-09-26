// 方法一：将 Blob 转换为字符串
export function blobToString(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (event) => {
			const base64String = event.target?.result as string;
			const base64Data = base64String.split(',')[1];
			if (base64Data) {
				resolve(base64Data);
			} else {
				reject(new Error('Failed to convert Blob to Base64.'));
			}
		};

		reader.onerror = () => {
			reject(new Error('Failed to read Blob as Base64.'));
		};

		reader.readAsDataURL(blob);
	});
}

// 方法二：将字符串转换为 Blob
export function stringToBlob(base64String: string, mimeType?: string): Blob {
	const byteCharacters = atob(base64String);
	const byteNumbers = new Array(byteCharacters.length);

	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}

	const byteArray = new Uint8Array(byteNumbers);
	return new Blob([byteArray], { type: mimeType });
}
