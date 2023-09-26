<script lang="ts">
	import { goto } from '$app/navigation';
	import { css } from '$lib/components/atom-css';
	import Goback from '$lib/components/goback.svelte';
	import Skeleton from '$lib/components/skeleton.svelte';
	import { catcher } from '$lib/helpers/catcher';
	import { locationSearch } from '$lib/helpers/location-search';
	import { toastMessage } from '$lib/helpers/toast';
	import { i18n, i18nFromKey } from '$lib/i18n';
	import type { AnalyzeClient } from '$lib/server/sentence/analyze';
	import { lastType, movieText, paragraphText, sceneText } from '$lib/stores/last-edit';
	import { user } from '$lib/stores/user';
	import { trpc } from '$lib/trpc-client';
	import { onMount } from 'svelte';

	$: titleKey = ($user.learn + 'Title') as 'enTitle';
	$: localTitleKey = ($user.local + 'Title') as 'zhTitle';

	let loading = false;
	let loaddingMore = false;
	let analyzeId = locationSearch().get('id');

	let analyze: AnalyzeClient;
	let error = '';
	let memoryIds: Record<string, { memoryId: number; sentenceId: number }> = {};
	let learing = new Set();
	let lastEdit = (() => {
		if ($lastType === 'scene') {
			return $sceneText;
		}
		if ($lastType === 'movie') {
			return $movieText;
		}
		return $paragraphText;
	})();

	async function handleReload() {
		error = '';
		loading = true;

		const res = await catcher(
			$lastType === 'movie'
				? trpc.analyzeMovie.mutate({
						auth: user.getAuth(),
						text: lastEdit,
						learn: $user.learn as 'en',
						analyzeId: Number(analyzeId),
				  })
				: trpc.analyze.query({
						auth: user.getAuth(),
						text: lastEdit,
						type: $lastType,
						learn: $user.learn as 'en',
						analyzeId: Number(analyzeId),
				  }),
		);
		loading = false;
		if ('rejected' in res) {
			error = i18nFromKey(res.message);
			return;
		}
		analyze = res as unknown as AnalyzeClient;
	}
	onMount(() => {
		handleReload();
	});

	$: learn = $user.learn as 'en';
	$: local = $user.local as 'zh';

	async function handleAddLearn(text: string) {
		const nowSentence = analyze.answer.find((v) => v[learn] === text);
		if (!nowSentence || nowSentence.loading) {
			return;
		}
		if (learing.has(text)) {
			if (memoryIds[nowSentence[learn]]) {
				await catcher(
					trpc.deleteMemory.mutate({
						auth: user.getAuth(),
						memoryId: memoryIds[nowSentence[learn]]!.memoryId,
						noFrist: true,
					}),
				);
			}

			learing.delete(text);
			learing = learing;
		} else {
			nowSentence.loading = true;
			analyze = analyze;
			const res = await catcher(
				trpc.sentence.mutate({
					auth: user.getAuth(),
					sentence: nowSentence[learn],
					translate: nowSentence[local],
					difficulty: nowSentence.difficulty || 0.2,
					memorization: nowSentence.memorization || 0.3,
					learn: $user.learn as 'en',
					local: $user.local as 'zh',
				}),
			);

			nowSentence.loading = false;
			analyze = analyze;
			if ('rejected' in res) {
				toastMessage(res);
				return;
			}
			memoryIds[nowSentence[learn]] = {
				memoryId: res.memoryId,
				sentenceId: res.id,
			};
			learing = learing.add(text);
		}
	}
	async function showMore() {
		if (loaddingMore) {
			return;
		}
		loaddingMore = true;
		const res = await catcher(
			trpc.analyze.query({
				auth: user.getAuth(),
				text: lastEdit,
				learn: $user.learn as 'en',
				type: $lastType,
				lastSentences: analyze.answer,
			}),
		);
		loaddingMore = false;
		if ('rejected' in res) {
			return;
		}
		analyze = res as unknown as AnalyzeClient;
	}
</script>

<Goback>
	{#if !loading}
		<a href="/brain" aria-label="add memory" class={css.button}>
			{i18n`返回大脑页面`} ({learing.size})
		</a>
	{/if}
</Goback>

{#if loading}
	<h2 class="text-lg font-semibold p-4">{i18n`Analyzing`}...</h2>
	<h2 class="text-md font-semibold p-4 pt-0">
		{i18n`AI 正在为您提供的信息生成内容、推荐及母语翻译，需要大概 30 秒的时间`}...
	</h2>
	<Skeleton class="p-4 w-full" />
	<Skeleton class="p-4 w-full" />
	<Skeleton class="p-4 w-full" />
{:else if error}
	<h2 class="text-lg font-semibold p-4 text-center text-red-500 mt-20">
		{i18n`分析失败, 对于 AI 自动分析来说这是有概率的，建议你点击下面的按钮重试`}
	</h2>
	<button class="mt-4 {css.button} mx-auto" on:click={handleReload}>{i18n`重新分析`}</button>
{:else if analyze?.answer?.length}
	<div class="p-4">
		{#if analyze.image}
			<div class="relative">
				<img
					src={analyze.image}
					alt={analyze[titleKey]}
					class="rounded-2xl mb-6 h-72 w-full object-cover"
				/>
				<a href={analyze.imageUserUrl} target="_blank">
					<iconify-icon
						icon="ri:unsplash-fill"
						class="right-4 bottom-4 absolute text-white"
						width="1.5rem"
					/>
				</a>
			</div>
		{/if}
		<h2 class="text-xl font-semibold">{analyze[titleKey]}</h2>
		{#if analyze[localTitleKey]}
			<h2 class="text-md text-gray-500 mb-3">{analyze[localTitleKey]}</h2>
		{/if}
		<div class="text-xs mt-2">
			<span class="font-semibold">{i18n`Difficulty`}:</span>
			<span>{i18n`指的是 AI 认为句子的难度`}</span>
		</div>
		<div class="text-xs">
			<span class="font-semibold">{i18n`Memorization`}:</span>
			<span>{i18n`指的是 AI 建议你记忆的程度`}</span>
		</div>
	</div>
	<div class="flex flex-col gap-3 p-4">
		{#each analyze.answer as item, index}
			<button
				class="{css.card} {learing.has(item[learn])
					? 'border-primary-600'
					: 'border-gray-300'} ring-primary-700"
				on:click={() => {
					handleAddLearn(item[learn]);
				}}
			>
				<div class="flex flex-row justify-between items-center">
					<div class="flex flex-row">
						<div
							class="h-6 mr-2 bg-green-400 text-white px-2 rounded flex flex-row justify-center items-center"
						>
							{index + 1}
						</div>
						<p>{item[learn]}</p>
					</div>
					<div class="ml-3 h-10">
						<button
							class={learing.has(item[learn]) ? css.miniCard : ''}
							on:click|stopPropagation|preventDefault={() => {
								if (learing.has(item[learn]) && memoryIds[item[learn]]) {
									const mem = memoryIds[item[learn]];
									goto(`/brain/${mem.memoryId}/${mem.sentenceId}/0`);
								}
							}}
						>
							<iconify-icon
								width="1.2rem"
								class={learing.has(item[learn]) ? 'text-primary-500' : 'text-gray-500'}
								icon={item.loading
									? 'line-md:loading-loop'
									: learing.has(item[learn])
									? 'carbon:view'
									: 'fluent:add-12-regular'}
							/>
						</button>
						<div class="text-[0.7rem] text-gray-500 {item.loading ? 'opacity-1' : 'opacity-0'}">
							15s
						</div>
					</div>
				</div>
				{#if item[local]}
					<div class="ml-8 py-2">
						<p class="text-sm text-gray-500">{item[local]}</p>
					</div>
				{/if}

				{#each [{ label: i18n`Difficulty`, value: item.difficulty }, { label: i18n`Memorization`, value: item.memorization }] as line}
					{#if line.value}
						<div class="flex flex-row items-center mt-3">
							<div class="text-[10px] mr-4 w-[70px]">{line.label}</div>
							<div class="w-full h-[2px] bg-gray-100 mt-1 flex-1">
								<div
									class="bg-green-500 h-full"
									style="width: {line.value ? line.value * 100 : 2}%;"
								/>
							</div>
						</div>
					{/if}
				{/each}
			</button>
		{/each}
	</div>
	{#if $lastType === 'scene' && !analyzeId}
		<div class="flex flex-col items-center justify-center">
			<button
				disabled={loaddingMore}
				class="h-9 disabled:bg-gray-300 {css.button}"
				on:click={showMore}
			>
				{#if loaddingMore}
					<iconify-icon icon="eos-icons:loading" />
				{:else}
					{i18n`分析更多的句子`}
				{/if}
			</button>
		</div>
	{/if}
{/if}
