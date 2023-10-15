<script lang="ts">
	import { css } from '$lib/components/atom-css';
	import Tab from '$lib/components/tab.svelte';
	import { i18n } from '$lib/i18n';
	import { article } from '$lib/stores/article';
	import { twMerge } from 'tailwind-merge';
</script>

<main id="setting" aria-label="setting page" class="flex flex-col p-4 min-h-full h-full">
	<div class="h-[calc(100vh-250px)] flex flex-col w-full gap-4">
		<h2 class="text-xl font-semibold">{i18n`文章`}</h2>
		<div>{i18n`你粘贴任何你希望长期反复学习的文章, 然后可以反复朗读和背诵它`}</div>
		<textarea bind:value={$article} class={twMerge(css.input, 'flex-1')} />
		<a class={twMerge(css.button, 'w-full sm:max-w-full h-12')} href="/article/learn">
			{i18n`学习这段内容`}
		</a>
	</div>
</main>

<Tab selected={1} />
