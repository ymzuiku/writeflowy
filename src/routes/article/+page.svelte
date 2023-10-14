<script lang="ts">
	import { css } from '$lib/components/atom-css';
	import Tab from '$lib/components/tab.svelte';
	import { i18n } from '$lib/i18n';
	import { article } from '$lib/stores/article';
	import { twMerge } from 'tailwind-merge';
</script>

<main id="setting" aria-label="setting page" class="flex flex-col p-4 min-h-full h-full gap-4">
	<h2 class="text-xl font-semibold">{i18n`文章`}</h2>
	<textarea bind:value={$article} class={twMerge(css.input, 'h-[calc(100vh-250px)]')} />
	<a class={twMerge(css.button, 'w-full sm:max-w-full')} href="/article/learn">
		{i18n`学习这段内容`}
	</a>
</main>

<Tab selected={1} />
