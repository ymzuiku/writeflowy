export function sendCodeWait(times: number, event: (times: number) => void) {
	if (times === 0) {
		return;
	}
	const nowTimes = 60 - ~~((Date.now() - times) / 1000);
	event(nowTimes);
	if (nowTimes > 0) {
		setTimeout(() => {
			sendCodeWait(times, event);
		}, 1000);
	}
}
