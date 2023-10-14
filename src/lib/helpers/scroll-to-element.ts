export function scrollToElement(element?: HTMLElement | null) {
	if (element) {
		const offsetTop = element.offsetTop;
		const windowHeight = window.innerHeight || document.documentElement.clientHeight;
		const scrollPosition = offsetTop - windowHeight / 2;
		window.scrollTo({
			top: scrollPosition,
			behavior: 'smooth',
		});
	}
}
