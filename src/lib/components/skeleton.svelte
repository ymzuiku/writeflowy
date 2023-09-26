<script lang="ts">
	const widths = [`w-[95%]`, `w-[60%]`, `w-[100%]`, `w-[90%]`, `w-[70%]`];
	let className = '';
	export { className as class };
	export let count = 5;
	export let id = '';
	$: arrs = () => {
		return new Array(count).fill('').map((v, i) => {
			return widths[i % 5];
		});
	};
</script>

<div {id} role="status" class="animate-pulse w-full {className}">
	<div class="h-2.5 bg-gray-200 rounded-full w-48 mb-4" />
	{#each arrs() as item}
		<div class="h-2 bg-gray-200 rounded-full {item} mb-2.5" />
	{/each}
</div>
