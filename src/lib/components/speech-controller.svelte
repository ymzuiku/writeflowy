<script>
	import { copyWords } from '$lib/helpers/copy-words';
	import { loopPlay, speechConnect, speedAudio, speeds } from '$lib/stores/brain-store';
	import { twMerge } from 'tailwind-merge';
	import { css } from './atom-css';
	export let text = '';
	export let copy = false;
	export let loop = false;
	export let connect = false;
</script>

<div
	class="flex flex-col justify-center gap-4 p-4 pb-10 fixed w-full sm:max-w-2xl bottom-0 bg-white z-20 shadow-up"
>
	<div class="flex flex-row items-center mb-1 gap-4 w-full">
		{#if copy}
			<button class={twMerge(css.miniCard)} on:click={() => copyWords(text)}>
				<iconify-icon width="1.4rem" class="text-gray-400" icon="ci:copy" />
			</button>
		{/if}
		<div class="flex-1" />
		{#if connect}
			<button on:click={() => ($speechConnect = !$speechConnect)} class={twMerge(css.miniCard)}>
				<iconify-icon
					icon="teenyicons:curved-connector-solid"
					width="1.3rem"
					class={$speechConnect ? 'text-primary-500' : 'text-gray-400'}
				/>
			</button>
		{/if}
		{#if loop}
			<button on:click={() => ($loopPlay = !$loopPlay)} class={twMerge(css.miniCard)}>
				<iconify-icon
					icon="eos-icons:infinity"
					width="1.3rem"
					class={$loopPlay ? 'text-primary-500' : 'text-gray-400'}
				/>
			</button>
		{/if}

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
	</div>
</div>
