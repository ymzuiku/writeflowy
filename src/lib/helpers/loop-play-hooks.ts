import { browser } from '$app/environment';
import { speechCache } from '$lib/components/speech-cache';
import { loopPlay, speechConnect, speechPeople, speedAudio } from '$lib/stores/brain-store';
import { user } from '$lib/stores/user';
import { onDestroy, onMount } from 'svelte';
import { get } from 'svelte/store';
import { scrollToElement } from './scroll-to-element';

export function loopPlayHooks() {
	let loopUpdateTimer: ReturnType<typeof setTimeout>;

	onMount(() => {
		if (browser) {
			let nextAudio: HTMLAudioElement | null;
			loopUpdateTimer = setInterval(() => {
				if (speechCache.lastAudio?.paused) {
					scrollToElement(nextAudio?.parentElement?.parentElement);

					if (get(speechConnect)) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						if ((speechCache.lastAudio as any).nowConnect === void 0) {
							return;
						}
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const connectId = (speechCache.lastAudio as any).nowConnect + 1;
						if (nextAudio?.parentElement) {
							nextAudio.parentElement.style.border = 'none';
						}
						nextAudio = document.querySelector(
							`[data-connect-audio="${connectId}"]`,
						) as HTMLAudioElement;
						if (nextAudio) {
							if (nextAudio?.parentElement) {
								nextAudio.parentElement.style.border = '1px solid #33f';
							}
							const src = `/brain/audio?${new URLSearchParams({
								text: nextAudio.getAttribute('data-text') || '',
								people: get(speechPeople),
								learn: get(user).learn,
							}).toString()}`;
							if (speechCache.lastAudio.src === src) {
								return;
							}
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							(speechCache.lastAudio as any).nowConnect += 1;
							speechCache.lastAudio.src = src;
							speechCache.lastAudio.load();
							speechCache.lastAudio.playbackRate = get(speedAudio);
							speechCache.lastAudio.currentTime = 0.05;
							speechCache.lastAudio.play();
						}
					} else if (get(loopPlay)) {
						speechCache.lastAudio.currentTime = 0.05;
						speechCache.lastAudio.playbackRate = 1;
						speechCache.lastAudio.pause();
						speechCache.lastAudio.load();
						speechCache.lastAudio.currentTime = 0.05;
						speechCache.lastAudio.playbackRate = get(speedAudio);
						speechCache.lastAudio.play();
					} else {
						speechCache.lastAudio.pause();
						speechCache.lastAudio = null;
					}
				}
			}, 600);
		}
	});
	onDestroy(() => {
		if (browser) {
			clearInterval(loopUpdateTimer);
		}
	});
}
