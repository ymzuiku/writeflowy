<script lang="ts">
	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { css } from '$lib/components/atom-css';
	import ChangeLanguage from '$lib/components/change-language.svelte';
	import Field from '$lib/components/field.svelte';
	import RightArrow from '$lib/components/right-arrow.svelte';
	import SelectLearn from '$lib/components/select-learn.svelte';
	import SelectLocal from '$lib/components/select-local.svelte';
	import Tab from '$lib/components/tab.svelte';
	import { catcher } from '$lib/helpers/catcher';
	import { nightwind } from '$lib/helpers/night-change';
	import { toastError, toastMessage } from '$lib/helpers/toast';
	import { i18n } from '$lib/i18n';
	import { user } from '$lib/stores/user';
	import { trpc } from '$lib/trpc-client';
	import { onMount, tick } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	let dark = nightwind.init();

	function handleLogout() {
		if (confirm(i18n`确定要登出吗`)) {
			localStorage.clear();
			goto('/');
		}
	}

	async function handleRemoveSubscrib() {
		const email = prompt(i18n`很抱歉我们的产品没有让你满意，很抱歉，请输入您的邮箱以退订：`);
		if (email !== $user.email) {
			toastError(i18n`您输入的邮箱不正确`);
			return;
		}
		if ($user.vipDays > 5) {
			if (
				!confirm(
					i18n`你当前月份的 VIP 天数还有很多，建议在剩余天数 5 天内再退订， 您确定要退订吗？`,
				)
			) {
				return;
			}
		}

		const res = await catcher(trpc.removeSubscrib.mutate({ auth: user.getAuth() }));
		toastMessage(res);
		if ('ok' in res) {
			location.reload();
		}
	}
	function handleReloadVipdays() {
		if (!$user.vipDays) {
			if (!document.getElementById('setting')) {
				return;
			}
			setTimeout(async () => {
				await user.getVipDays();
				await tick();
				handleReloadVipdays();
			}, 3500);
		}
	}
	onMount(() => {
		handleReloadVipdays();
	});
</script>

<main id="setting" aria-label="setting page" class="flex flex-col p-4 min-h-full h-full gap-4">
	<h2 class="text-xl font-semibold">{i18n`设置`}</h2>
	{#if !$user.vipDays}
		<button class="flex flex-col justify-center items-center">
			{#if dev}
				<stripe-buy-button
					class="min-h-[400px]"
					client-reference-id={$user.id}
					customer-email={$user.email}
					buy-button-id="buy_btn_1NrvMIA8JL8mMhfDOeo3hVTL"
					publishable-key="pk_test_51NrtEHA8JL8mMhfDTyeY5TnC4OwLFKwB5WxeMVKdns148OrenIC2pW3hFMW98qnHd1LrqRk8giOWVmJel0sSAeK200BZgS2lOs"
				/>
			{:else}
				<stripe-buy-button
					class="min-h-[400px]"
					client-reference-id={$user.id}
					customer-email={$user.email}
					buy-button-id="buy_btn_1Ns0mFA8JL8mMhfDuiHagrbQ"
					publishable-key="pk_live_51NrtEHA8JL8mMhfDmXJ9i77EAyEbt9f5jmnOe9mFcvLeqN6xqJ5FBWpufX1mzMw5I3xpgYfzB1UyqFGr3ExIKTjL00nSfR0Mp9"
				/>
			{/if}
		</button>
		<div
			class={twMerge(
				'bg-green-500  cursor-default mx-auto mb-6 text-white p-3 rounded-lg flex flex-row justify-center items-center',
			)}
		>
			<iconify-icon class="mr-2" icon="mingcute:vip-1-fill" />
			{i18n`剩余免费试用天数:`}
			<span class="text-xl ml-3">{7 - $user.tryDays}</span>
		</div>
	{:else}
		<div class={twMerge(css.card, 'flex flex-col sm:flex-row justify-between items-center')}>
			<img class="max-w-sm" src="/svg/setting.svg" alt="setting" />
			<div>
				<h2 class="text-sm mb-4">
					{i18n`感谢你，你已订阅完整的 VIP`}. {i18n`本月剩余天数`}:
					<span class="text-2xl font-light text-green-500">{$user.vipDays}</span>
				</h2>
				<button
					class={twMerge(css.button, 'bg-red-400 hover:bg-red-500')}
					on:click={handleRemoveSubscrib}
				>
					<iconify-icon class="mr-2" icon="mingcute:vip-1-fill" />
					{i18n`退订`}
				</button>
			</div>
		</div>
	{/if}
	<Field weakTitle for="change-lang" title={i18n`界面语言`}>
		<ChangeLanguage class="w-full" />
	</Field>
	<Field weakTitle title={i18n`学习语言`}>
		<SelectLearn />
	</Field>
	<Field weakTitle for="change-lang" title={i18n`母语`}>
		<SelectLocal />
	</Field>
	<Field weakTitle for="change-lang" title={i18n`黑暗主题`}>
		<label class="relative inline-flex items-center cursor-pointer">
			<input
				type="checkbox"
				value={dark}
				on:change={(e) => nightwind.enable(e.currentTarget.checked)}
				class="sr-only peer"
			/>
			<div
				class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
			/>
		</label>
	</Field>
	<Field weakTitle title={i18n`个人资料`}>
		<a
			href="/setting/update-infomation"
			aria-label="goto update-information"
			class="{css.card} flex flex-row justify-between items-center px-3 w-full"
		>
			<span>{i18n`修改个人资料`}</span>
			<RightArrow />
		</a>
	</Field>
	<Field weakTitle title={i18n`修改密码`}>
		<a
			href="/login/forget-password?email={$user.email}"
			aria-label="goto forget-password"
			class="{css.card} flex flex-row justify-between items-center px-3 w-full"
		>
			<span>{i18n`去修改密码`}</span>
			<RightArrow />
		</a>
	</Field>
	<Field weakTitle title={i18n`登出`}>
		<button
			on:click={handleLogout}
			aria-label="logout button"
			class="{css.card} flex flex-row justify-between items-center px-3 w-full"
		>
			<span>{i18n`点击登出`}</span>
			<RightArrow />
		</button>
	</Field>
	<div class="h-20" />
</main>

<Tab selected={2} />
