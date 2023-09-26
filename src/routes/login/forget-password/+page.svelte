<script lang="ts">
	import { goto } from '$app/navigation';
	import { css } from '$lib/components/atom-css';
	import Goback from '$lib/components/goback.svelte';
	import SendVerificationCode from '$lib/components/send-verification-code.svelte';
	import { catcher } from '$lib/helpers/catcher';
	import { locationSearch } from '$lib/helpers/location-search';
	import { toastMessage } from '$lib/helpers/toast';
	import { i18n } from '$lib/i18n';
	import { trpc } from '$lib/trpc-client';
	import { twMerge } from 'tailwind-merge';

	const search = locationSearch();
	let email = search.get('email') || '';
	let password = '';
	let code = '';

	async function sendCode() {
		if (!email) {
			return false;
		}

		const res = await catcher(trpc.sendForgtpasswordEmail.mutate({ email }));
		toastMessage(res);
		return true;
	}
	async function submit() {
		const res = await catcher(trpc.forgetPassword.mutate({ email, code, password }));
		toastMessage(res);
		if ('rejected' in res) {
			return;
		}
		goto('/login');
	}
</script>

<Goback />
<div>
	<div class="flex min-h-full flex-col justify-center px-6 py-12 pt-0 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-sm">
			<img class="mx-auto h-8 w-auto" src="/logo.svg" alt="Your Company" />
			<h2 class="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
				{i18n`Forget password`}
			</h2>
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<form class="space-y-4" on:submit|preventDefault={submit}>
				<div>
					<label for="email" class="block text-sm font-medium leading-6 text-gray-900">
						{i18n`Email address`}
					</label>
					<div class="mt-2">
						<input
							tabindex={1}
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

				<div>
					<div class="flex items-center justify-between">
						<label for="code" class="block text-sm font-medium leading-6 text-gray-900 flex-1">
							{i18n`验证码`}
						</label>
					</div>
					<SendVerificationCode
						tabindex={3}
						id="forget-password-code"
						bind:value={code}
						onClick={sendCode}
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium leading-6 text-gray-900">
						{i18n`New password`}
					</label>
					<div class="mt-2">
						<input
							tabindex={4}
							bind:value={password}
							id="password"
							name="password"
							type="password"
							aria-label="password input"
							required
							class={twMerge(css.input, 'h-12 w-full')}
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						aria-label="change password"
						tabindex={4}
						class={twMerge(css.button, 'h-12 w-full')}
					>
						{i18n`Change password`}
					</button>
				</div>
			</form>

			<p class="mt-10 text-center text-sm text-gray-500">
				{i18n`已是会员`}?
				<a href="/login" class="font-semibold leading-6 text-primary-600 hover:text-primary-500">
					{i18n`登录`}
				</a>
			</p>
		</div>
	</div>
</div>
