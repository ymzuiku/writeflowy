import { goto } from '$app/navigation';
import { catcher } from '$lib/helpers/catcher';
import { toastError } from '$lib/helpers/toast';
import { getLanguage } from '$lib/i18n';
import { storable } from '$lib/stores/storable';
import { trpc } from '$lib/trpc-client';
import type { User } from '@prisma/client';
import { get } from 'svelte/store';

type ClientUser = Omit<User, 'password'>;
const store = storable<ClientUser & { vipDays: number; tryDays: number; vip: boolean }>('user', {
	created: new Date(),
	email: '',
	id: 0,
	token: '',
	updated: new Date(),
	name: '',
	address: '',
	current_company: '',
	desired_company: '',
	education: '',
	occupation: '',
	personal_intro: '',
	skills: '',
	target_position: '',
	years_of_experience: 0,
	vipDays: 0,
	tryDays: 0,
	learn: 'en',
	local: getLanguage(),
	vip: false,
});

let checkTokenLock = false;

export const user = {
	...store,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setByResponse: (res: any) => {
		store.set({
			created: new Date(res.created),
			updated: new Date(res.updated),
			...res,
		});
	},
	getAuth: () => {
		return { email: get(user).email, token: get(user).token || '' };
	},
	checkToken: async () => {
		if (checkTokenLock) {
			return;
		}
		await new Promise((res) => setTimeout(res, 500));
		checkTokenLock = true;
		const auth = user.getAuth();

		if (auth.token) {
			const res = await catcher(trpc.token.mutate(auth));
			if ('rejected' in res) {
				user.update((v) => ({ ...v, token: '' }));
				goto('/');
				return;
			}
			user.update((v) => {
				const base = { learn: 'en', local: 'zh' };
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return { ...base, ...v, ...(res as any) };
			});
			await user.getVipDays();
			if (location.pathname === '/' || location.pathname === '/login') {
				goto('/home/' + get(user).learn);
			}
		} else {
			goto('/');
		}
	},
	getVipDays: async () => {
		const auth = user.getAuth();
		if (!auth.token) {
			return;
		}
		catcher(trpc.getVipDays.mutate(auth)).then((res) => {
			if ('rejected' in res) {
				toastError(res);
				return;
			}
			user.update((v) => {
				return {
					...v,
					vip: res.days > 0 || res.tryDays < 8,
					vipDays: res.days,
					tryDays: res.tryDays,
				};
			});
		});
	},
};
