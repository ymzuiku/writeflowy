import { browser } from '$app/environment';
import { NanoIndexed } from '$lib/helpers/nano-indexed';
import { get, writable } from 'svelte/store';

const db = NanoIndexed({
	dbName: 'writeflowy',
	store: 'db',
});

export function indexed<T>(key: string, data: T) {
	const store = writable(data);
	const { subscribe, set } = store;

	if (browser) {
		db.get(key).then((res) => {
			if (res) {
				set(res);
			}
		});
	}

	return {
		subscribe,
		set: (n: T) => {
			if (browser) {
				db.set(key, n);
			}
			set(n);
		},
		update: (cb: (v: T) => T) => {
			const updatedStore = cb(get(store));
			if (browser) {
				db.set(key, updatedStore);
			}
			set(updatedStore);
		},
		onInit: () => {},
	};
}
