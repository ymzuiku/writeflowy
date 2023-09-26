export const nightwind = {
	init: () => {
		if (typeof window === 'undefined') {
			return 'light';
		}
		const persistedColorPreference = window.localStorage.getItem('nightwind-mode');
		const hasPersistedPreference = typeof persistedColorPreference === 'string';
		if (hasPersistedPreference) {
			return persistedColorPreference;
		}
		const mql = window.matchMedia('(prefers-color-scheme: dark)');
		const hasMediaQueryPreference = typeof mql.matches === 'boolean';
		if (hasMediaQueryPreference) {
			return mql.matches ? 'dark' : 'light';
		}
		return 'light';
	},
	beforeTransition: () => {
		if (typeof window === 'undefined') {
			return;
		}
		const doc = document.documentElement;
		const onTransitionDone = () => {
			doc.classList.remove('nightwind');
			doc.removeEventListener('transitionend', onTransitionDone);
		};
		doc.addEventListener('transitionend', onTransitionDone);
		if (!doc.classList.contains('nightwind')) {
			doc.classList.add('nightwind');
		}
	},

	toggle: () => {
		if (typeof window === 'undefined') {
			return;
		}
		nightwind.beforeTransition();
		if (!document.documentElement.classList.contains('dark')) {
			document.documentElement.classList.add('dark');
			window.localStorage.setItem('nightwind-mode', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			window.localStorage.setItem('nightwind-mode', 'light');
		}
	},

	enable: (dark: boolean) => {
		if (typeof window === 'undefined') {
			return;
		}
		const mode = dark ? 'dark' : 'light';
		const opposite = dark ? 'light' : 'dark';

		nightwind.beforeTransition();

		if (document.documentElement.classList.contains(opposite)) {
			document.documentElement.classList.remove(opposite);
		}
		document.documentElement.classList.add(mode);
		window.localStorage.setItem('nightwind-mode', mode);
	},
};
