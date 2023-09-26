<script lang="ts">
	import { getIsIOS } from '$lib/helpers/get-is-ios';
	import { i18n } from '$lib/i18n';
	import { onMount } from 'svelte';

	let addHome = false;
	let showAlert = false;

	function handleToHomeScreen() {
		showAlert = true;
		// alert(i18n`点击分享按钮， 然后选择：添加到主屏幕`);
	}

	onMount(() => {
		if (window.matchMedia('(display-mode: standalone)').matches) {
			addHome = false;
		} else if (getIsIOS()) {
			addHome = true;
		}
	});
</script>

{#if addHome}
	<div class="w-full h-12 sm:hidden" />
	<button
		class="w-full fixed top-0 h-12 z-50 sm:hidden bg-white text-green-500 shadow-sm text-center flex flex-row justify-center items-center gap-3"
		on:click={handleToHomeScreen}
	>
		<iconify-icon width="2rem" icon="healthicons:mobile" />
		<span>{i18n`请将网站添加到主屏幕`}</span>
	</button>
{/if}
{#if showAlert}
	<button
		class="fixed z-[1000] left-0 top-0 w-screen h-screen bg-black bg-opacity-50 flex flex-col justify-center items-center"
		on:click={() => (showAlert = false)}
	>
		<!-- <button class="w-full mb-2" on:click={() => (showAlert = false)}>
			<iconify-icon width="2rem" icon="zondicons:close-solid" class="text-white" />
		</button> -->
		<video
			playsinline
			muted
			autoplay
			poster="/video/writeflowy-ios.png"
			class="rounded-3xl h-[80vh] mb-10 object-contain shadow-2xl"
		>
			<source src="/video/writeflowy-ios.mp4" type="video/mp4" />
		</video>
	</button>
{/if}
