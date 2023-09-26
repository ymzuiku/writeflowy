<script lang="ts">
	import { goto } from '$app/navigation';
	import { css } from '$lib/components/atom-css';
	import Goback from '$lib/components/goback.svelte';
	import { i18n } from '$lib/i18n';
	import { lastType, movieText, paragraphText, sceneText } from '$lib/stores/last-edit';
	import { user } from '$lib/stores/user';
	import { twMerge } from 'tailwind-merge';
	export let inPage = true;

	let selectorItems = [
		{ icon: 'material-symbols:scene-outline', value: 'scene', label: i18n`情景分析` },
		{ icon: 'ph:paragraph-bold', value: 'paragraph', label: i18n`段落分析` },
		{ icon: 'tdesign:movie-clapper', value: 'movie', label: i18n`电影字幕` },
	] as const;
</script>

{#if inPage}
	<Goback />
{/if}

<form
	aria-label="analyza-input page"
	class="flex flex-col pt-4 px-4 flex-1"
	on:submit|preventDefault={() => goto(`/home/${$user.learn}/analyze-response`)}
>
	{#if inPage}
		<h2 class="text-xl font-semibold mb-6">{i18n`分析`}</h2>
	{/if}

	<div class="flex flex-row gap-3 mb-4">
		{#each selectorItems as item}
			<button
				type="button"
				aria-label="type {item.value}"
				class="flex-1 rounded-md border p-2 {$lastType === item.value
					? 'border-primary-500 text-primary-500 bg-white'
					: 'border-transparent text-gray-400'}"
				on:click={() => ($lastType = item.value)}
			>
				<iconify-icon width="1.5rem" icon={item.icon} />
				<div class="text-xs">{item.label}</div>
			</button>
		{/each}
	</div>

	{#if $lastType === 'scene'}
		<textarea
			maxlength="5000"
			class={twMerge(css.input, 'resize-none h-52')}
			placeholder={i18n`请输入一个场景， 例如：我是一个全栈工程师，现在在做技术面试, 最多输入 3000 个字符`}
			bind:value={$sceneText}
		/>
	{:else if $lastType === 'paragraph'}
		<textarea
			maxlength="5000"
			class={twMerge(css.input, 'resize-none h-52')}
			placeholder={i18n`请输入你要学习段落, AI 会分析你的段落给于你需要学习的句子的建议, 最多输入 5000 个字符`}
			bind:value={$paragraphText}
		/>
	{:else}
		<textarea
			maxlength="90000"
			class={twMerge(css.input, 'resize-none h-52')}
			placeholder={i18n`请输入你英文电影字幕片段，只支持 srt 文件格式的内容`}
			bind:value={$movieText}
		/>
	{/if}
	<button
		class="flex flex-row bg-primary-600 text-white rounded-lg h-10 mt-4 justify-center items-center"
		type="submit"
	>
		<iconify-icon icon="bxs:magic-wand" width="1.5rem" class="mr-4" />
		{#if $lastType === 'scene'}
			<span>{i18n`AI 生成`}</span>
		{:else if $lastType === 'paragraph'}
			<span>{i18n`AI 分析`}</span>
		{:else}
			<span>{i18n`解析`}</span>
		{/if}
	</button>
	<div class="h-5" />
</form>
