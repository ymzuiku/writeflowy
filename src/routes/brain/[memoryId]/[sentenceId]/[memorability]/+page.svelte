<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { css } from '$lib/components/atom-css';
	import Goback from '$lib/components/goback.svelte';
	import Skeleton from '$lib/components/skeleton.svelte';
	import { catcher } from '$lib/helpers/catcher';
	import { toastMessage } from '$lib/helpers/toast';
	import { i18n } from '$lib/i18n';
	import type { SentenceExplain } from '$lib/server/sentence/sentence';
	import {
		loopPlay,
		memoryListType,
		memoryTap,
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
	import type { PageServerData } from './$types';

	let audioLoaded: Record<string, string> = {};
	let loading = false;
	let lastPlayAudio: HTMLAudioElement | null;
	let lastText = '';

	export let data: PageServerData;
	$: explain = (
		data && 'explain' in data
			? JSON.parse(data.explain || '{}')
			: { split: {}, step_by_step: {}, translate: '' }
	) as SentenceExplain;

	$: explainList = $memoryTap === 'Phrase' ? explain.split : explain.step_by_step;

	async function handleUpdateMemory(memorabilityChange: number) {
		if (loading) {
			return;
		}
		loading = true;
		if (lastPlayAudio) {
			lastPlayAudio.pause();
		}
		let memorability = data.memorability! + memorabilityChange;
		if (memorability > 1) {
			memorability = 1;
		} else if (memorability < 0) {
			memorability = 0;
		}
		const res = await catcher(
			trpc.updateMemory.mutate({ auth: user.getAuth(), memorability, memoryId: data.memoryId! }),
		);
		loading = false;
		if (!res) {
			history.back();
			return;
		}
		if ('rejected' in res) {
			toastMessage(res);
			return;
		}
		goto(`/brain/${res.id}/${res.sentenceId}/${res.memorability}`, { replaceState: true });
	}

	async function removeMember() {
		if (!confirm(i18n`确定要移除这个句子吗？`)) {
			return;
		}
		const res = await catcher(
			trpc.deleteMemory.mutate({ auth: user.getAuth(), memoryId: data.memoryId! }),
		);
		if ('rejected' in res) {
			toastMessage(res);
			return;
		}
		history.back();
	}

	const handleSpeech = async (e: { currentTarget: HTMLElement }, text?: string) => {
		if (!text) {
			return;
		}

		const button = e.currentTarget;
		const nowAudio = button.querySelector('audio');
		if (nowAudio) {
			if (lastPlayAudio === nowAudio) {
				nowAudio.currentTime = 0.01;
				nowAudio.pause();
				lastPlayAudio = null;
				lastText = '';
				return;
			}
			lastText = text;
			lastPlayAudio = nowAudio;
		}
		audioLoaded = {
			...audioLoaded,
			[text]: `/brain/audio?${new URLSearchParams({
				text: text || '',
				people: $speechPeople,
				learn: $user.learn,
			}).toString()}`,
		};
		await tick();

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

	$: if (browser && lastPlayAudio) {
		lastPlayAudio.playbackRate = $speedAudio;
	}
	let loopUpdateTimer: ReturnType<typeof setTimeout>;
	onMount(() => {
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
						lastText = '';
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

<Goback>
	<div class="flex flex-row">
		<div class="flex-1" />
		<div class="inline-flex rounded-md">
			<button
				aria-current="page"
				class="{twMerge(css.card, 'rounded-r-none')} {$memoryTap === 'Step'
					? 'text-blue-700'
					: 'text-gray-400'}"
				on:click={() => ($memoryTap = 'Step')}
			>
				<iconify-icon icon="tdesign:slice" />
			</button>
			<button
				class="{twMerge(css.card, 'rounded-none')} {$memoryTap === 'Phrase'
					? 'text-blue-700'
					: 'text-gray-400'}"
				on:click={() => ($memoryTap = 'Phrase')}
			>
				<iconify-icon icon="uil:pizza-slice" />
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
<div class="p-4 flex-1">
	{#if !data}
		<Skeleton count={10} />
	{:else}
		<button
			class={twMerge(css.card, 'p-4 my-6 w-full')}
			on:click={(e) => handleSpeech(e, data.text)}
		>
			<audio class="pointer-events-none" src={audioLoaded[data.text || '']} />
			<div
				class="text-xl text-left pointer-events-none {lastText === data.text
					? 'text-primary-600'
					: 'text-black'}"
			>
				{data.text}
			</div>
			<div class="mt-3 text-lg text-gray-500 text-left pointer-events-none">
				{explain.translate}
			</div>
			<div class="flex flex-row items-center mt-3 pointer-events-none">
				<div class="text-[10px] mr-4 w-[70px]">{i18n`Memorability`}</div>
				<div class="w-full h-[4px] bg-gray-100 flex-1">
					<div
						class="bg-green-500 h-full"
						style="width: {data.memorability ? data.memorability * 100 : 1}%;"
					/>
				</div>
			</div>
		</button>
		<div class="flex flex-col gap-4">
			{#each Object.keys(explainList) as key}
				<button
					class={twMerge(
						css.card,
						'flex flex-row gap-4 px-4 py-0 min-h-12',
						lastText === key ? 'text-primary-600' : 'text-black',
					)}
					on:click={(e) => handleSpeech(e, key)}
				>
					<audio class="pointer-events-none" src={audioLoaded[key || '']} />
					<div
						class="py-3 self-center text-left min-w-[60px] max-w-[50%] flex-shrink-0 pointer-events-none"
					>
						{key}
					</div>
					<div class="py-3 text-gray-500 text-left pointer-events-none">{explainList[key]}</div>
				</button>
			{/each}
		</div>
		<div class="h-48" />
	{/if}
</div>

<div
	class="flex flex-col justify-center gap-4 p-4 pb-10 fixed w-full sm:max-w-2xl bottom-0 bg-white z-20 shadow-up"
>
	<div class="flex flex-row items-center mb-1 gap-4 w-full">
		<button class={twMerge(css.miniCard)} on:click={removeMember}>
			<iconify-icon width="1.4rem" class="text-gray-400" icon="mdi:delete-outline" />
		</button>
		<div class="flex-1" />
		<button on:click={() => ($loopPlay = !$loopPlay)} class={twMerge(css.miniCard)}>
			<iconify-icon
				icon="eos-icons:infinity"
				width="1.3rem"
				class={$loopPlay ? 'text-primary-500' : 'text-gray-400'}
			/>
		</button>

		<div class="inline-flex rounded-md">
			<button
				class={twMerge(css.miniCard, '-mr-0 rounded-r-none')}
				on:click={() => ($speedAudio = 0.26)}
			>
				<iconify-icon
					icon="lucide:snail"
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
					width="1.6rem"
					class={$speedAudio === 1.25 ? 'text-primary-500' : 'text-gray-400'}
				/>
			</button>
		</div>
		{#if $memoryListType === 'Today'}
			<button
				on:click={() => {
					handleUpdateMemory(0.08);
				}}
				disabled={loading}
				class={twMerge(css.miniCard, 'disabled:pointer-events-none')}
			>
				{#if loading}
					<iconify-icon icon="iline-md:loading-loop" width="1.4rem" class={'text-gray-400'} />
				{:else}
					<iconify-icon icon="icon-park-outline:brain" width="1.4rem" class={'text-gray-400'} />
				{/if}
			</button>
		{/if}
	</div>
</div>
