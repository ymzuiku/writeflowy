export function sendCodeWait(times: number, event: (times: number) => void) {
	event(times);
	if (times > 0) {
		setTimeout(() => {
			sendCodeWait(times - 1, event);
		}, 1000);
	}
}
