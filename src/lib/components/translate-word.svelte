<script lang="ts">
	import { translateGoogle } from '$lib/helpers/translate-google';
	import { learnWorls } from '$lib/stores/learn-words';
	import { user } from '$lib/stores/user';
	import Speech from './speech.svelte';

	export let text = '';
	$: translate = $learnWorls[text] || '';

	const handleTranslate = async () => {
		if (translate) {
			learnWorls.update((v) => {
				delete v[text];
				return { ...v };
			});
			return;
		}
		const value = await translateGoogle(text, $user.local);
		learnWorls.update((v) => {
			return { ...v, [text]: value };
		});
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<span on:click={handleTranslate} class="cursor-pointer hover:opacity-75">
	<Speech {text}>{text}</Speech>
	{#if translate}
		<span class="text-sm mx-[2px] text-gray-500">{translate}</span>
	{/if}
</span>
