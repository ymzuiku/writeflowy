<script lang="ts">
	import { goto } from '$app/navigation';
	import { css } from '$lib/components/atom-css';
	import ChangeLanguage from '$lib/components/change-language.svelte';
	import Goback from '$lib/components/goback.svelte';
	import SendVerificationCode from '$lib/components/send-verification-code.svelte';
	import { catcher } from '$lib/helpers/catcher';
	import { locationSearch } from '$lib/helpers/location-search';
	import { toastMessage } from '$lib/helpers/toast';
	import { getLanguage, i18n } from '$lib/i18n';
	import { user } from '$lib/stores/user';
	import { trpc } from '$lib/trpc-client';
	import { twMerge } from 'tailwind-merge';
	const search = locationSearch();
	let email = search.get('email') || '';
	let password = '';
	let code = '';
	async function handleSendCode() {
		if (!email) {
			return false;
		}
		const res = await catcher(trpc.sendSignUpEmail.mutate({ email }));
		toastMessage(res);
		return true;
	}
	async function submit(e: Event) {
		e.preventDefault();
		const res = await catcher(
			trpc.signUp.mutate({ email, code, password, local: getLanguage() as 'en' }),
		);
		toastMessage(res);
		if ('ok' in res) {
			const userRes = await catcher(trpc.login.mutate({ email, password }));
			if ('rejected' in userRes) {
				toastMessage(userRes);
				return;
			}
			user.setByResponse(userRes);
			goto('/home/' + $user.learn);
		}
	}
</script>

<Goback />

<div>
	<div class="flex min-h-full flex-col justify-center px-6 pb-12 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-sm">
			<img class="mx-auto h-8 w-auto" src="/logo.svg" alt="Your Company" />
			<h2
				aria-label="sign-up title"
				class="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
			>
				{i18n`Start a 7 day free trial`}
			</h2>
		</div>

		<div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
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
						<label for="password" class="block text-sm font-medium leading-6 text-gray-900">
							{i18n`Password`}
						</label>
					</div>
					<div class="mt-2">
						<input
							bind:value={password}
							id="password"
							tabindex={2}
							name="password"
							type="password"
							aria-label="password input"
							autocomplete="current-password"
							required
							class={twMerge(css.input, 'h-12 w-full')}
						/>
					</div>
				</div>

				<div>
					<div class="flex items-center justify-between">
						<label for="code" class="block text-sm font-medium leading-6 text-gray-900">
							{i18n`验证码`}
						</label>
					</div>
					<SendVerificationCode
						tabindex={4}
						id="sign-up-code"
						bind:value={code}
						onClick={handleSendCode}
					/>
				</div>
				<!-- <Field title="{i18n`邀请码`} ({i18n`可选`})">
					<input tabindex={5} bind:value={invitation} class={twMerge(css.input, 'h-12 w-full')} />
				</Field> -->

				<div>
					<button
						tabindex={5}
						aria-label="sign in"
						type="submit"
						class={twMerge(css.button, 'w-full h-12')}
					>
						{i18n`Sign in`}
					</button>
				</div>
			</form>

			<p class="mt-10 text-center text-sm text-gray-500">
				{i18n`已是会员`}?
				<a
					tabindex={5}
					aria-label="goto login"
					href="/login"
					class="font-semibold leading-6 text-primary-600 hover:text-primary-500"
				>
					{i18n`登录`}
				</a>
			</p>
		</div>
		<div class="absolute left-1/2 -translate-x-1/2 bottom-4">
			<ChangeLanguage class="mt-6 border-none" />
		</div>
	</div>
</div>
