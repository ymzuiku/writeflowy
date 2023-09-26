<script lang="ts">
	import { css } from '$lib/components/atom-css';
	import AutoLoadMore from '$lib/components/auto-load-more.svelte';
	import Tab from '$lib/components/tab.svelte';
	import { catcher } from '$lib/helpers/catcher';
	import { toastMessage } from '$lib/helpers/toast';
	import { i18n } from '$lib/i18n';
	import { user } from '$lib/stores/user';
	import { trpc } from '$lib/trpc-client';
	import dayjs from 'dayjs';
	import { twMerge } from 'tailwind-merge';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	let limit = 15;
	let offset = 0;
	let search = '';
	let tab = 'AI';
	$: titleKey = ($user.learn + 'Title') as 'enTitle';
	$: localTitleKey = ($user.local + 'Title') as 'zhTitle';

	async function handleShowMore() {
		offset += data.list.length;
		const res = await catcher(
			trpc.getAnalyzes.mutate({
				title: search,
				offset,
				order: 'updated',
				limit,
				learn: $user.learn as 'en',
				creatorId: tab === 'Personal' ? $user.id : void 0,
			}),
		);
		if ('rejected' in res) {
			toastMessage(res);
			return;
		}

		data = {
			count: res.count,
			list: [...data.list, ...res.list],
		};
	}
	function handleSearch() {
		data = {
			count: 0,
			list: [],
		} as unknown as PageServerData;
		handleShowMore();
	}
	function handleChangeLoadSelf(theTab: string) {
		tab = theTab;
		handleSearch();
	}
</script>

<main class="flex flex-col">
	<div class="inline-flex rounded-md my-4 px-4 mx-auto">
		<button
			aria-current="page"
			class="{twMerge(css.card, 'rounded-r-none')} {tab === 'AI'
				? 'text-blue-700'
				: 'text-gray-400'}"
			on:click={() => handleChangeLoadSelf('AI')}
		>
			{i18n`订制`}
		</button>
		<button
			aria-current="page"
			class="{twMerge(css.card, 'rounded-none')} {tab === 'Community'
				? 'text-blue-700'
				: 'text-gray-400'}"
			on:click={() => handleChangeLoadSelf('Community')}
		>
			{i18n`Community`}
		</button>
		<button
			class="{twMerge(css.card, 'rounded-l-none')} {tab === 'Personal'
				? 'text-blue-700'
				: 'text-gray-400'}"
			on:click={() => handleChangeLoadSelf('Personal')}
		>
			{i18n`历史`}
		</button>
	</div>
	{#if tab === 'AI'}
		<section class="flex-1" aria-label="home page section">
			<img class="w-full max-h-[35vh] mt-0" src="/svg/no-order.svg" alt="cat" />
			<div class="px-12 text-sm">
				{i18n`By using AI, we analyze your context, English paragraphs, and movie subtitles to extract memory and association suggestions for individual sentences. Additionally, we employ the principles of the forgetting curve to assist you in managing the content you need to study daily.`}
			</div>
		</section>
		<div class="p-10 pt-0 flex flex-row justify-center items-center">
			<a
				href="/home/{$user.learn}/analyza-input"
				aria-label="next"
				class={twMerge(css.deepButton, 'max-w-xs h-12 mt-4 mb-10 flex flex-row items-center')}
			>
				<iconify-icon width="1.2rem" class="mr-2" icon="bxs:magic-wand" />
				{i18n`AI 生成学习内容`}
			</a>
		</div>
		<div class="h-20" />
	{:else}
		<div class="flex flex-col px-4 gap-2">
			<form class="relative" on:submit|preventDefault={handleSearch}>
				<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
					<svg
						class="w-4 h-4 text-gray-500"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 20"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
						/>
					</svg>
				</div>
				<input
					type="search"
					bind:value={search}
					id="default-search"
					class="block w-full p-4 pl-10 text-sm text-gray-900 border-none shadow-sm rounded-lg bg-white focus:ring-primary-500 focus:border-primary-500"
					placeholder="Search Mockups, Logos..."
				/>
				<button type="submit" class={twMerge(css.deepButton, 'absolute right-2.5 bottom-2')}>
					{i18n`Search`}
				</button>
			</form>

			{#each data.list as item}
				<a
					class={twMerge(css.card, 'flex flex-row')}
					href="/home/{$user.learn}/analyze-response?id={item.id}"
				>
					{#if item.image}
						<img
							alt={item[titleKey]}
							src={item.image}
							class="w-40 h-28 object-cover mr-6 rounded-lg"
						/>
					{/if}
					<div>
						<h3>{item[titleKey]}</h3>
						{#if item[localTitleKey]}
							<h4 class="text-gray-500 text-md py-2">{item[localTitleKey]}</h4>
						{/if}

						<div class="text-xs text-gray-400 mt-2">{dayjs(item.updated).format('MM/DD YYYY')}</div>
					</div>
				</a>
			{/each}
		</div>
		<AutoLoadMore needLoad={data.count > data.list.length} onLoad={handleShowMore} />
	{/if}
</main>
<Tab selected={0} />
