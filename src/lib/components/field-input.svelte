<script lang="ts">
	import type { FormEventHandler, HTMLInputTypeAttribute } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { css } from './atom-css';

	let className = '';
	export { className as class };
	export let title = 'title';
	export let tabindex = 0;
	export let labelClass = '';
	export let value: number | string = '';
	export let id = 'name';
	export let type: HTMLInputTypeAttribute = 'text';
	export let required = false;
	export let weakTitle = false;

	$: ariaLabel = id + ' input';

	const handleInput: FormEventHandler<HTMLInputElement> = (e) => {
		value = type.match(/^(number|range)$/) ? +e.currentTarget.value : e.currentTarget.value;
	};
</script>

<div>
	<label
		for={id}
		class="block text-sm font-medium leading-6 {weakTitle
			? 'text-gray-400'
			: 'text-gray-900'} {labelClass}"
	>
		{title}
	</label>
	<div class="mt-2">
		<input
			{value}
			{id}
			name={id}
			{type}
			tabindex={tabindex ? tabindex : void 0}
			aria-label={ariaLabel}
			on:input={handleInput}
			{required}
			class={twMerge(css.input, 'w-full h-12', className)}
		/>
	</div>
</div>
