import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';

export function storable<T>(key: string, data: T) {
	const store = writable(data);
	const { subscribe, set } = store;

	if (browser && localStorage[key]) {
		try {
			const old = JSON.parse(localStorage[key]);
			if (old && old.v) {
				set(old.v);
			}
		} catch (err) {
			//
		}
	}

	return {
		subscribe,
		set: (n: T) => {
			browser && (localStorage[key] = JSON.stringify({ v: n }));
			set(n);
		},
		update: (cb: (v: T) => T) => {
			const updatedStore = cb(get(store));

			browser && (localStorage[key] = JSON.stringify({ v: updatedStore }));
			set(updatedStore);
		},
		onInit: () => {},
	};
}
