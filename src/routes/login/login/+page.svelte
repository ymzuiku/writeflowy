<script lang="ts">
	import { goto } from '$app/navigation';
	import { css } from '$lib/components/atom-css';
	import ChangeLanguage from '$lib/components/change-language.svelte';
	import { catcher } from '$lib/helpers/catcher';
	import { locationSearch } from '$lib/helpers/location-search';
	import { toastMessage } from '$lib/helpers/toast';
	import { i18n } from '$lib/i18n';
	import { user } from '$lib/stores/user';
	import { trpc } from '$lib/trpc-client';
	import { twMerge } from 'tailwind-merge';
	const search = locationSearch();
	let email = search.get('email') || '';
	let password = '';
	async function submit() {
		const res = await catcher(trpc.login.mutate({ email, password }));
		if ('rejected' in res) {
			toastMessage(res);
			return;
		}
		user.setByResponse(res);
		goto('/home/' + $user.learn);
	}
</script>

<div>
	<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-sm">
			<img class="mx-auto h-14 w-auto" src="/logo.svg" alt="Your Company" />
			<h2
				aria-label="login title"
				class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
			>
				{i18n`Sign in to your account`}
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
						<div class="text-sm">
							<a
								tabindex={-1}
								aria-label="goto forget password"
								href="/login/forget-password?email={email}"
								class="font-semibold text-primary-600 hover:text-primary-500"
							>
								{i18n`Forgot password`}?
							</a>
						</div>
					</div>
					<div class="mt-2">
						<input
							bind:value={password}
							aria-label="password input"
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							class={twMerge(css.input, 'h-12 w-full')}
						/>
					</div>
				</div>

				<div class="mt-4">
					<button aria-label="sign in" type="submit" class={twMerge(css.button, 'h-12 w-full')}>
						{i18n`Sign in`}
					</button>
				</div>
			</form>

			<p class="mt-10 text-center text-sm text-gray-500">
				{i18n`Not a member`}?
				<a
					aria-label="goto sign-up"
					href="/login/sign-up"
					class="font-semibold leading-6 text-primary-600 hover:text-primary-500"
				>
					{i18n`Start a 7 day free trial`}
				</a>
			</p>
		</div>
		<div class="absolute left-1/2 -translate-x-1/2 bottom-4">
			<ChangeLanguage class="mt-6 border-none" />
		</div>
	</div>
</div>
