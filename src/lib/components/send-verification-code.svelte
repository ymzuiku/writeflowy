<script lang="ts">
	import { sendCodeWait } from '$lib/helpers/send-code-wait';
	import { i18n } from '$lib/i18n';
	import { storable } from '$lib/stores/storable';
	import { onMount } from 'svelte';

	export let value = '';
	export let onClick = async () => true;
	export let id = 'send-verification-code';
	let times = storable(id + '__times', 0);
	export let tabindex = 1;
	let buttonTabindex = tabindex - 1;
	let sending = false;
	let nowTimes = 0;
	onMount(() => {
		sendCodeWait($times, (t) => {
			nowTimes = t;
		});
	});

	async function sendCode() {
		if (sending) {
			return;
		}
		sending = true;
		setTimeout(() => {
			sending = false;
		}, 5000);
		if (await Promise.resolve(onClick())) {
			$times = Date.now();
			sendCodeWait(Date.now(), (t) => {
				nowTimes = t;
			});
		}
	}
</script>

<div>
	<div
		class="mt-2 flex flex-row gap-3 pl-3 pr-2 flex-[2] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600 sm:text-sm sm:leading-6 bg-white"
	>
		<input
			{tabindex}
			bind:value
			id="code"
			name="code"
			aria-label="code input"
			type="code"
			class="border-0 ring-0 focus:ring-0 outline-none"
		/>
		{#if nowTimes > 0}
			<button
				tabindex={buttonTabindex}
				type="button"
				aria-label="send code"
				disabled
				class="flex flex-1 justify-center cursor-not-allowed rounded-md bg-gray-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
			>
				{nowTimes}s
			</button>
		{:else}
			<button
				tabindex={buttonTabindex}
				type="button"
				disabled={sending}
				aria-label="send code"
				on:click={sendCode}
				class="flex flex-1 justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-30 disabled:pointer-events-none"
			>
				{i18n`发送验证码`}
			</button>
		{/if}
	</div>
</div>
