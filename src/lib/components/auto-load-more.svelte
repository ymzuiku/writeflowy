<script lang="ts">
	import { onMount } from 'svelte';
	import Skeleton from './skeleton.svelte';

	export let needLoad = true;
	export let onLoad = () => {};
	export let id = 'load-more';
	let loading = false;
	async function loadMore() {
		if (loading) {
			return;
		}
		loading = true;
		await Promise.resolve(onLoad());
		loading = false;
	}

	let bottomHTML: HTMLElement;

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entrie) => {
				if (entrie.isIntersecting) {
					if (entrie.target.querySelector('#' + id)) {
						if (needLoad) {
							loadMore();
						}
					}
				}
			});
		});

		observer.observe(bottomHTML);
	});
</script>

<div bind:this={bottomHTML}>
	{#if needLoad}
		<Skeleton {id} class="mt-8" />
	{/if}
</div>
