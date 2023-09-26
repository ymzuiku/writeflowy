<script lang="ts">
	import type { FormEventHandler, HTMLInputTypeAttribute } from 'svelte/elements';

	let className = '';
	export { className as class };
	export let value: number | string = '';
	export let id = 'name';
	export let type: HTMLInputTypeAttribute = 'text';
	export let required = false;

	$: ariaLabel = id + ' input';

	const handleInput: FormEventHandler<HTMLInputElement> = (e) => {
		value = type.match(/^(number|range)$/) ? +e.currentTarget.value : e.currentTarget.value;
	};
</script>

<input
	{value}
	{id}
	name={id}
	{type}
	aria-label={ariaLabel}
	on:input={handleInput}
	{required}
	class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 {className}"
/>
