<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';

	let isVisible = false;
	let className = '';
	export { className as class };

	// 获取元素的引用
	let element: HTMLSpanElement;

	// 在组件挂载后和更新后检查元素是否在屏幕中可见
	afterUpdate(() => {
		if (element) {
			checkVisibility();
		}
	});

	function checkVisibility() {
		if (!element) {
			return;
		}
		const rect = element.getBoundingClientRect();
		const windowHeight = window.innerHeight || document.documentElement.clientHeight;

		if (rect.top >= 0 && rect.bottom <= windowHeight) {
			isVisible = true;
		} else {
			isVisible = false;
		}
	}

	onMount(() => {
		window.addEventListener('scroll', checkVisibility);
		return () => {
			window.removeEventListener('scroll', checkVisibility);
		};
	});
</script>

<div bind:this={element} class={className}>
	{#if isVisible}
		<slot />
	{/if}
</div>
