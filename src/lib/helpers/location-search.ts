export function locationSearch() {
	if (typeof window === 'undefined') {
		return {
			get: () => '',
			has: () => false,
			size: 0,
			forEach: () => {},
		} as unknown as URLSearchParams;
	}
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams;
}
