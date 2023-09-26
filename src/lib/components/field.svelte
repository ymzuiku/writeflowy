<script lang="ts">
	export let title = 'title';
	export let labelClass = '';
	let forValue = '';
	export { forValue as for };
	export let weakTitle = false;
</script>

<div>
	<label
		for={forValue}
		class="block text-sm font-medium leading-6 {weakTitle
			? 'text-gray-400'
			: 'text-gray-900'} {labelClass}"
	>
		{title}
	</label>
	<div class="mt-2">
		<slot />
	</div>
</div>
