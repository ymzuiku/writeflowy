<script lang="ts">
	import { catcher } from '$lib/helpers/catcher';
	import { toastMessage } from '$lib/helpers/toast';
	import { i18n } from '$lib/i18n';
	import { user } from '$lib/stores/user';
	import { trpc } from '$lib/trpc-client';
	import { tick } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { css } from './atom-css';

	let className = '';
	export { className as class };

	export let onUpdate = () => {};

	async function handleUpdateInfo(local: string) {
		user.update((v) => {
			return { ...v, local };
		});
		await tick();
		const res = await catcher(
			trpc.updateInfomation.mutate({
				auth: user.getAuth(),
				data: { local },
			}),
		);
		if ('rejected' in res) {
			toastMessage(res);
		}

		onUpdate();
	}
</script>

<select
	class={twMerge(css.card, 'w-full', className)}
	value={$user.local}
	on:change={(e) => handleUpdateInfo(e.currentTarget.value)}
>
	<option value="en">{i18n`我的母语是英语`}</option>
	<option value="es">{i18n`我的母语是西班牙语`}</option>
	<option value="zh">{i18n`我的母语是中文`}</option>
	<option value="jp">{i18n`我的母语是日语`}</option>
	<option value="fr">{i18n`我的母语是法语`}</option>
</select>
