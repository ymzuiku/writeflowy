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
		const nowAudio = button.querySelector('audio');

		if (nowAudio && !connectNext) {
			if (speechCache.lastAudio === nowAudio) {
				nowAudio.currentTime = 0.01;
				nowAudio.pause();
				speechCache.lastAudio = null;
				return;
			}
			speechCache.lastAudio = nowAudio;
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
				audio.currentTime = 0.1;
				audio.pause();
			}
		});
		if (nowAudio) {
			nowAudio.load();
			nowAudio.playbackRate = $speedAudio;
			nowAudio.volume = 1;
			nowAudio.currentTime = 0.1;
			nowAudio.play();
			nowAudio.currentTime = 0.1;
		}
	};

	let audio: HTMLAudioElement;
	onMount(() => {
		if (connect >= 0 && audio) {
			/* eslint-disable @typescript-eslint/no-explicit-any */
			(audio as any).nowConnect = connect;
			// (audio as any).handleSpeech = handleSpeech;
		}
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click={(e) => handleSpeech(e)} class={className}>
	<audio
		data-text={text}
		data-connect-audio={connect}
		bind:this={audio}
		class="pointer-events-none"
		src={audioLoaded[text || '']}
	/>
	<slot />
</span>
