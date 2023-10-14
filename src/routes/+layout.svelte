<script lang="ts">
	import { browser } from '$app/environment';
	import { preloadCode } from '$app/navigation';
	import AddHomeScreen from '$lib/components/add-home-screen.svelte';
	import { nightwind } from '$lib/helpers/night-change';
	import { user } from '$lib/stores/user';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import './styles.css';

	let loading = false;

	onMount(async () => {
		if (browser) {
			nightwind.init();
			preloadCode('/home/[learn]');

			loading = true;
			await user.checkToken();
			loading = false;

			preloadCode('/login');
			preloadCode('/login/sign-up');
			preloadCode('/brain');
			preloadCode('/brain/[memoryId]/[sentenceId]/[memorabillity]');
			preloadCode('/setting');
			preloadCode('/article');
			preloadCode('/article/learn');
			preloadCode('/setting/update-infomation');
		}
	});
</script>

<div class="bg-gray-50 text-black min-h-screen">
	<div class="width-auto sm:max-w-2xl mx-auto min-h-full flex flex-col">
		<AddHomeScreen />
		{#if loading}
			<div class="flex flex-col items-center justify-center mt-20">
				<iconify-icon icon="line-md:loading-loop" width="1.5rem" class="text-gray-500" />
			</div>
		{:else}
			<slot />
		{/if}

		<SvelteToast --toastBorderRadius="8px" --toastBarHeight="3px" options={{ intro: { y: -64 } }} />
		<div class="min-h-[2rem]" />
	</div>
</div>
