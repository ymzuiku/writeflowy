<script lang="ts">
	import { browser } from '$app/environment';
	import { css } from '$lib/components/atom-css';
	import AutoLoadMore from '$lib/components/auto-load-more.svelte';
	import Goback from '$lib/components/goback.svelte';
	import Skeleton from '$lib/components/skeleton.svelte';
	import Tab from '$lib/components/tab.svelte';
	import { catcher } from '$lib/helpers/catcher';
	import { copyWords } from '$lib/helpers/copy-words';
	import { toastMessage } from '$lib/helpers/toast';

	import { i18n } from '$lib/i18n';
	import type { MemorysOutput } from '$lib/server/memory/memorys';
	import {
		loopPlay,
		memoryListType,
		peopleList,
		speechPeople,
		speedAudio,
		speeds,
	} from '$lib/stores/brain-store';
	import { user } from '$lib/stores/user';
	import { trpc } from '$lib/trpc-client';
	import { onDestroy, onMount, tick } from 'svelte';
	import { get } from 'svelte/store';
	import { twMerge } from 'tailwind-merge';

	let audioLoaded: Record<string, string> = {};
	let lastPlayAudio: HTMLAudioElement | null;
	let loading = false;
	let limit = 15;
	let lastText = '';
	let offset = 0;
	let memorys: Awaited<MemorysOutput>['list'] = [];
	let data: Awaited<MemorysOutput>['list'][0] | null = null;
	let count = 0;
	async function handleLoad(reload?: boolean) {
		loading = true;
		const res = await catcher(
			trpc.memorys.mutate({ auth: user.getAuth(), limit, offset, all: $memoryListType === 'All' }),
		);
		if ('rejected' in res) {
			toastMessage(res);
			return;
		}
		if (!Array.isArray(res.list)) {
			return;
		}
		loading = false;
		count = res.count;
		if (reload) {
			memorys = [...res.list];
		} else {
			memorys = [...memorys, ...res.list];
		}
	}

	function handleChangeTab(key: string) {
		$memoryListType = key;
		handleLoad(true);
	}

	function handleLoadMore() {
		offset = memorys.length;
		handleLoad();
	}

	async function removeMember() {
		if (!data) {
			return;
		}
		if (!confirm(i18n`确定要移除这个句子吗？`)) {
			return;
		}
		const res = await catcher(
			trpc.deleteMemory.mutate({ auth: user.getAuth(), memoryId: data.id }),
		);
		if ('rejected' in res) {
			toastMessage(res);
			return;
		}
		handleLoad(true);
	}

	async function handleUpdateMemory(
		memorabilityChange: number,
		memory?: Awaited<MemorysOutput>['list'][0],
	) {
		if (loading) {
			return;
		}

		const theData = memory || data;
		if (!theData) {
			return;
		}
		if (lastPlayAudio) {
			lastPlayAudio.pause();
		}
		loading = true;
		let memorability = theData.memorability + memorabilityChange;
		if (memorability > 1) {
			memorability = 1;
		} else if (memorability < 0) {
			memorability = 0;
		}
		const res = await catcher(
			trpc.updateMemory.mutate({ auth: user.getAuth(), memorability, memoryId: theData.id }),
		);
		loading = false;
		if (res && 'rejected' in res) {
			toastMessage(res);
			return;
		}
		await handleLoad(true);
		lastPlayAudio = null;
		data = null;
	}

	$: if (browser && lastPlayAudio) {
		lastPlayAudio.playbackRate = $speedAudio;
	}

	const handleSpeech = async (
		e: { currentTarget: HTMLElement },
		memory: Awaited<MemorysOutput>['list'][0],
	) => {
		if (!memory) {
			return;
		}
		const text = memory.text;
		lastText = text;

		const button = e.currentTarget;
		const nowAudio = button.querySelector('audio');
		if (nowAudio) {
			if (lastPlayAudio === nowAudio) {
				nowAudio.currentTime = 0.01;
				nowAudio.pause();
				lastPlayAudio = null;
				data = null;
				return;
			}
			lastPlayAudio = nowAudio;
			data = memory;
		}
		if (text) {
			audioLoaded = {
				...audioLoaded,
				[text]: `/brain/audio?${new URLSearchParams({
					text: text || '',
					people: $speechPeople,
					learn: $user.learn,
				}).toString()}`,
			};
			await tick();
			nowAudio?.load();
		}

		document.querySelectorAll('audio').forEach((audio) => {
			if (!audio.paused && audio !== nowAudio) {
				audio.currentTime = 0.01;
				audio.pause();
			}
		});
		if (nowAudio) {
			nowAudio.load();
			nowAudio.playbackRate = $speedAudio;
			nowAudio.volume = 1;
			nowAudio.currentTime = 0.01;
			nowAudio.play();
			nowAudio.currentTime = 0.01;
		}
	};

	let loopUpdateTimer: ReturnType<typeof setTimeout>;
	onMount(() => {
		handleLoad(true);
		if (browser) {
			loopUpdateTimer = setInterval(() => {
				if (lastPlayAudio && lastPlayAudio.duration - lastPlayAudio.currentTime <= 0.15) {
					if (get(loopPlay)) {
						lastPlayAudio.currentTime = 0.01;
						lastPlayAudio.playbackRate = 1;
						lastPlayAudio.pause();
						lastPlayAudio.load();
						lastPlayAudio.currentTime = 0.01;
						setTimeout(() => {
							if (lastPlayAudio) {
								lastPlayAudio.play();
							}
						}, 100);
					} else {
						lastPlayAudio.pause();
						lastPlayAudio = null;
						data = null;
					}
				}
			}, 100);
		}
	});
	onDestroy(() => {
		if (browser) {
			clearInterval(loopUpdateTimer);
		}
	});
</script>

<Goback hiddenBack>
	<div class="flex flex-row">
		<div class="flex-1" />
		<div class="inline-flex mx-auto">
			<button
				aria-current="page"
				class="{twMerge(css.card, 'rounded-r-none')} {$memoryListType === 'Today'
					? 'text-blue-700'
					: 'text-gray-400'}"
				on:click={() => handleChangeTab('Today')}
			>
				{i18n`Today`}
			</button>
			<button
				class="{twMerge(css.card, 'rounded-none')} {$memoryListType === 'All'
					? 'text-blue-700'
					: 'text-gray-400'}"
				on:click={() => handleChangeTab('All')}
			>
				{i18n`All`}
			</button>
			<div class={twMerge(css.selectBox, 'rounded-l-none')}>
				<iconify-icon icon="lucide:speech" width="1.4rem" class="text-gray-400" />
				<select bind:value={$speechPeople} class={css.selectNone}>
					{#each peopleList as people}
						{#if people.disabled}
							<option disabled value={people.value}>{people.type}</option>
						{:else}
							<option value={people.value}>
								{people.value}
							</option>
						{/if}
					{/each}
				</select>
			</div>
		</div>
	</div>
</Goback>

<main class="flex flex-col p-4 min-h-full h-full">
	<div class="flex flex-row items-center justify-start">
		<h2 class="text-xl font-semibold">{i18n`记忆`}</h2>
		<div class="text-sm text-gray-500 ml-4">{i18n`筛选`}: {$user.learn} to {$user.local}</div>
	</div>
	<p class="py-4 mb-4 text-sm text-gray-500">
		{i18n`已根据你的遗忘顺序进行排序， 你只需要按照这个列表反复学习，直到列表清空`}
	</p>

	{#if !memorys.length && loading}
		<Skeleton />
	{:else if memorys && !memorys.length}
		<img alt="all-done" class="max-h-[320px] mt-4" src="/svg/all-done.svg" />
	{:else}
		<div class="flex flex-col gap-4">
			{#each memorys as memory}
				<button class={twMerge(css.card, 'relative')} on:click={(e) => handleSpeech(e, memory)}>
					<audio class="pointer-events-none" src={audioLoaded[memory.text || '']} />
					<div class="flex-1 {data?.id === memory.id ? 'text-primary-500' : 'text-black'}">
						{memory.text}
					</div>
					{#if memory.translate}
						<div class="mt-2 text-gray-500">{memory.translate}</div>
					{/if}
					<div class="flex flex-row items-center mt-3">
						<div class="text-[10px] mr-4 w-[70px]">{i18n`Memorability`}</div>
						<div class="w-full h-[2px] bg-gray-100 mt-1 flex-1">
							<div
								class="bg-green-500 h-full"
								style="width: {memory.memorability ? memory.memorability * 100 : 1}%;"
							/>
						</div>
						<a
							class={twMerge(css.miniCard, 'top-4 right-4 text-gray-400 ml-3')}
							href="/brain/{memory.id}/{memory.sentenceId}/{memory.memorability}?type={$memoryListType}"
						>
							<iconify-icon width="1.4rem" icon="carbon:view" />
						</a>
						{#if $memoryListType === 'Today'}
							<button
								class={twMerge(
									css.miniCard,
									'ml-3 text-gray-400 disabled:text-gray-200 disabled:opacity-75 disabled:pointer-events-none',
								)}
								disabled={loading}
								on:click|stopPropagation={() => {
									handleUpdateMemory(0.08, memory);
								}}
							>
								{#if loading}
									<iconify-icon icon="line-md:loading-loop" />
								{:else}
									<iconify-icon width="1.3rem" icon="icon-park-outline:brain" />
								{/if}
							</button>
						{/if}
					</div>
				</button>
			{/each}
		</div>
	{/if}
	<AutoLoadMore needLoad={count > memorys.length} onLoad={handleLoadMore} />

	<div class="h-60" />
</main>

{#if memorys.length}
	<div
		class="flex flex-col justify-center gap-4 p-4 pb-4 sm:pb-10 fixed w-full sm:max-w-2xl bottom-20 sm:bottom-0 bg-white z-20 shadow-up"
	>
		<div class="flex flex-row items-center mb-1 gap-4 w-full">
			<button class={twMerge(css.miniCard)} on:click={removeMember}>
				<iconify-icon width="1.4rem" class="text-gray-400" icon="mdi:delete-outline" />
			</button>
			<button class={twMerge(css.miniCard)} on:click={() => copyWords(lastText)}>
				<iconify-icon width="1.4rem" class="text-gray-400" icon="ci:copy" />
			</button>
			<div class="flex-1" />
			<button on:click={() => ($loopPlay = !$loopPlay)} class={twMerge(css.miniCard)}>
				<iconify-icon
					icon="fa6-solid:infinity"
					width="1.4rem"
					class={$loopPlay ? 'text-primary-500' : 'text-gray-400'}
				/>
			</button>

			<div class="inline-flex rounded-md">
				<button
					class={twMerge(css.miniCard, '-mr-0 rounded-r-none')}
					on:click={() => ($speedAudio = 0.26)}
				>
					<iconify-icon
						icon="fluent:animal-turtle-16-regular"
						width="1.4rem"
						class={$speedAudio === 0.26 ? 'text-primary-500' : 'text-gray-400'}
					/>
				</button>
				{#each speeds as item}
					<button
						aria-current="page"
						class="{twMerge(css.miniCard, 'rounded-none px-2')} {$speedAudio === item
							? 'text-primary-500'
							: 'text-gray-400'}"
						on:click={() => ($speedAudio = item)}
					>
						{#if item === 1}
							<iconify-icon width="1.4rem" icon="tabler:walk" />
						{:else if item === 0.75}
							<iconify-icon width="1.4rem" icon="ic:round-assist-walker" />
						{:else if item === 0.5}
							<iconify-icon width="1.9rem" icon="fluent:animal-turtle-16-regular" />
						{:else}
							{item}
						{/if}
					</button>
				{/each}
				<button
					class={twMerge(css.miniCard, '-mr-0 rounded-l-none')}
					on:click={() => ($speedAudio = 1.25)}
				>
					<iconify-icon
						icon="fluent:animal-rabbit-16-regular"
						width="1.5rem"
						class={$speedAudio === 1.25 ? 'text-primary-500' : 'text-gray-400'}
					/>
				</button>
			</div>
		</div>
	</div>
{/if}
<Tab selected={2} />
