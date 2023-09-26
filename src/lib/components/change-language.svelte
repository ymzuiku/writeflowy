<script lang="ts">
	import { getLanguage, languageList, setLanguage } from '$lib/i18n';
	import type { ChangeEventHandler } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { css } from './atom-css';

	let className = '';
	export { className as class };
	export let style = '';
	let nowLang = getLanguage();
	const handleChangeLang: ChangeEventHandler<HTMLSelectElement> = (e) => {
		nowLang = e.currentTarget.value;
		setLanguage(e.currentTarget.value as 'zh');
	};
</script>

<select
	value={nowLang}
	on:change={handleChangeLang}
	class={twMerge(css.card, 'pr-8', className)}
	{style}
>
	{#each languageList as lang}
		<option value={lang.value}>{lang.label}</option>
	{/each}
</select>
