export async function catcher<T>(target: Promise<T>) {
	try {
		const data = await target;
		return data;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		let message: string;
		if (err.message[0] === '[') {
			message = JSON.parse(err.message)[0]?.message || 'Invalid params';
		} else {
			message = err.message;
		}
		return {
			status: err.status || err.data?.httpStatus || 400,
			message,
			rejected: true,
			error: err,
		};
	}
}
