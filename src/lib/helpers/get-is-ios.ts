export function getIsIOS() {
	if (typeof window === 'undefined') {
		return false;
	}
	const userAgent = navigator.userAgent;
	return /iPhone|iPad|iPod/i.test(userAgent);
}
