<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	let visible = false;
	export const ref = {
		showModal: () => {
			visible = true;
		},
		close: () => {
			visible = false;
		},
	};
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if visible}
	<div
		class="fixed z-50 w-screen h-screen top-0 left-0 bg-gray-500 bg-opacity-70 flex flex-col justify-center items-center"
		on:keypress={() => {}}
		on:close
		role="alert"
		in:fade={{ duration: 100 }}
		out:fade={{ duration: 100 }}
		on:click={() => ref.close()}
	>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			in:fly={{ y: 50, duration: 100, opacity: 0 }}
			out:fly={{ y: 50, duration: 100 }}
			on:click|stopPropagation={() => {}}
		>
			<slot />
		</div>
	</div>
{/if}
