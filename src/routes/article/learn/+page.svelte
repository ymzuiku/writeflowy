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
	import { article, translateSentence } from '$lib/stores/article';
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
			<div class={twMerge(css.selectBox)}>
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
		<div class="flex flex-row gap-2 text-lg min-h-[60px]">
			<button class={css.miniCard} on:click={() => translateText(item.text)}>
				<iconify-icon icon="heroicons-outline:translate" />
			</button>

			<Speech connect={index} class={css.miniCard} text={item.text}>
				<iconify-icon icon="lucide:speech" />
			</Speech>
			<div>
				<div class="break-words mt-2">
					{#each splitWords(item.text) as word}
						<span class="ml-1">
							<TranslateWord text={word} />
						</span>
					{/each}
				</div>
				{#if $translateSentence[item.text]}
					<div class="text-sm mt-2 text-gray-500">{$translateSentence[item.text]}</div>
				{/if}
			</div>
		</div>
	{/each}

	<div class="h-20" />
</main>

<SpeechController connect loop text="hello" />
