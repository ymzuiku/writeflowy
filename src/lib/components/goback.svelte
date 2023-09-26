<script lang="ts">
	export let hiddenBack = false;
	let className = '';
	export { className as class };
	import { getIsIOS } from '$lib/helpers/get-is-ios';
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { css } from './atom-css';

	function goback() {
		if (window.history && window.history.length > 1) {
			history.back();
		} else {
			location.href = '/';
		}
	}
	let addHome = false;
	onMount(() => {
		if (window.matchMedia('(display-mode: standalone)').matches) {
			addHome = false;
		} else if (getIsIOS()) {
			addHome = true;
		}
	});
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<div
	class={twMerge(
		'sticky left-0 p-3 flex flex-row items-center justify-between top-0 z-10',
		addHome ? 'top-12 sm:top-0' : '',
		className,
	)}
>
	{#if !hiddenBack}
		<a
			href="javascript:void(0)"
			on:click={goback}
			class={twMerge(css.card, 'rounded-full w-12 h-12 p-0 flex justify-center items-center')}
		>
			<iconify-icon class="text-gray-700" icon="ion:chevron-back-outline" width="1.3rem" />
		</a>
	{:else}
		<div />
	{/if}
	<slot />
</div>
