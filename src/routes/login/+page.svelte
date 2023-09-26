<script lang="ts">
	import { goto } from '$app/navigation';
	import { css } from '$lib/components/atom-css';
	import ChangeLanguage from '$lib/components/change-language.svelte';
	import { catcher } from '$lib/helpers/catcher';
	import { toastMessage } from '$lib/helpers/toast';
	import { i18n } from '$lib/i18n';
	import { trpc } from '$lib/trpc-client';
	import { twMerge } from 'tailwind-merge';
	let email = '';

	async function submit() {
		const res = await catcher(trpc.checkLogin.mutate({ email }));
		if ('rejected' in res) {
			toastMessage(res);
			return;
		}
		if (res.signUp) {
			goto('/login/login?email=' + email);
		} else {
			goto('/login/sign-up?email=' + email);
		}
	}
</script>

<div>
	<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-sm">
			<img class="mx-auto h-14 w-auto" src="/logo.svg" alt="Your Company" />
			<h2
				aria-label="check login title"
				class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
			>
				Writeflowy
			</h2>
			<h3 class="mt-2 text-center text-md leading-9 tracking-tight text-gray-900">
				{i18n`利用 AI 帮你订制英语句子的学习`}
			</h3>
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<form class="space-y-4" on:submit|preventDefault={submit}>
				<div>
					<label for="email" class="block text-sm font-medium leading-6 text-gray-900">
						{i18n`Email`}
					</label>
					<div class="mt-2">
						<input
							bind:value={email}
							id="email"
							name="email"
							type="email"
							aria-label="email input"
							autocomplete="email"
							required
							class={twMerge(css.input, 'h-12 w-full')}
						/>
					</div>
				</div>

				<div class="mt-4">
					<button aria-label="next page" type="submit" class={twMerge(css.button, 'h-12 w-full')}>
						{i18n`Next`}
					</button>
				</div>
			</form>
		</div>
		<div class="absolute left-1/2 -translate-x-1/2 bottom-4">
			<ChangeLanguage class="mt-6 border-none" />
		</div>
	</div>
</div>
