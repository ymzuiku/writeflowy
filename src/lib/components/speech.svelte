<script lang="ts">
	import { speechPeople, speedAudio } from '$lib/stores/brain-store';
	import { user } from '$lib/stores/user';
	import { onMount, tick } from 'svelte';
	import { speechCache } from './speech-cache';
	export let text = '';
	let className = '';
	export let connect = -1;
	export { className as class };
	let audioLoaded: Record<string, string> = {};

	const handleSpeech = async (e: { currentTarget: HTMLElement }, connectNext?: boolean) => {
		const button = e.currentTarget;

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
		}

		const nowAudio = button.querySelector('audio');
		nowAudio?.load();

		if (nowAudio && !connectNext) {
			if (speechCache.lastAudio === nowAudio) {
				nowAudio.currentTime = 0.05;
				nowAudio.pause();
				speechCache.lastAudio = null;
				return;
			}
			speechCache.lastAudio = nowAudio;
		}

		document.querySelectorAll('audio').forEach((audio) => {
			if (!audio.paused && audio !== nowAudio) {
				audio.currentTime = 0.05;
				audio.pause();
			}
		});
		if (nowAudio) {
			nowAudio.load();
			nowAudio.playbackRate = $speedAudio;
			nowAudio.volume = 1;
			nowAudio.currentTime = 0.05;
			nowAudio.play();
			nowAudio.currentTime = 0.05;
		}
	};

	let span: HTMLSpanElement;
	onMount(() => {
		if (connect >= 0 && span) {
			/* eslint-disable @typescript-eslint/no-explicit-any */
			(span as any).nowConnect = connect;
			// (audio as any).handleSpeech = handleSpeech;
		}
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span
	bind:this={span}
	data-text={text}
	data-connect-audio={connect}
	on:click={(e) => handleSpeech(e)}
	class={className}
>
	{#if audioLoaded[text]}
		<audio class="pointer-events-none" src={audioLoaded[text || '']} />
	{/if}

	<slot />
</span>
