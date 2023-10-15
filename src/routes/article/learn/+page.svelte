<script lang="ts">
	import { css } from '$lib/components/atom-css';
	import Goback from '$lib/components/goback.svelte';
	import SpeechController from '$lib/components/speech-controller.svelte';
	import Speech from '$lib/components/speech.svelte';
	import TranslateWord from '$lib/components/translate-word.svelte';
	import { loopPlayHooks } from '$lib/helpers/loop-play-hooks';
	import { splitSentences } from '$lib/helpers/split-sentences';
	import { splitWords } from '$lib/helpers/split-words';
	import { translateGoogle } from '$lib/helpers/translate-google';
	import { article, articleFontSize, translateSentence } from '$lib/stores/article';
	import { peopleList, speechPeople } from '$lib/stores/brain-store';
	import { user } from '$lib/stores/user';
	import { twMerge } from 'tailwind-merge';

	$: list = splitSentences($article).map((v, i) => {
		return {
			index: i,
			text: v,
		};
	});

	const translateText = async (text: string) => {
		if ($translateSentence[text]) {
			translateSentence.update((v) => {
				delete v[text];
				return { ...v };
			});
			return;
		}
		const translateStr = await translateGoogle(text, $user.local);
		translateSentence.update((v) => {
			return { ...v, [text]: translateStr };
		});
	};
	loopPlayHooks();
</script>

<Goback>
	<div class="flex flex-row">
		<div class="flex-1" />
		<div class="inline-flex rounded-md">
			<div class={twMerge(css.selectBox, 'rounded-r-none')}>
				<iconify-icon icon="lucide:speech" width="1.4rem" class="text-gray-400" />
				<select bind:value={$articleFontSize} class={css.selectNone}>
					<option value="text-sm">S</option>
					<option value="text-md">M</option>
					<option value="text-lg">Lg</option>
					<option value="text-xl">XL</option>
					<option value="text-2xl">2xl</option>
					<option value="text-3xl">3XL</option>
					<option value="text-4xl">4XL</option>
					<option value="text-5xl">5XL</option>
				</select>
			</div>
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

<main id="setting" aria-label="setting page" class="flex flex-col p-4 min-h-full h-full gap-4">
	{#each list as item, index}
		<div class="flex flex-row gap-2 min-h-[60px]">
			<div>
				<Speech connect={index} class={twMerge(css.miniCard, 'rounded-b-none')} text={item.text}>
					<iconify-icon icon="lucide:speech" />
				</Speech>
				<button
					class={twMerge(css.miniCard, 'rounded-t-none')}
					on:click={() => translateText(item.text)}
				>
					<iconify-icon icon="heroicons-outline:translate" />
				</button>
			</div>
			<div>
				<div class={twMerge('break-words mt-2', $articleFontSize)}>
					{#each splitWords(item.text) as word}
						<span class="ml-1">
							<TranslateWord text={word} />
						</span>
					{/each}
				</div>
				{#if $translateSentence[item.text]}
					<div class={twMerge('mt-2 text-gray-500', $articleFontSize)}>
						{$translateSentence[item.text]}
					</div>
				{/if}
			</div>
		</div>
	{/each}

	<div class="h-20" />
</main>

<SpeechController connect loop text="hello" />
