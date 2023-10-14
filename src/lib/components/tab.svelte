<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { user } from '$lib/stores/user';

	export let selected = 0;
	const tabs = [
		{ title: i18n`添加单词`, icon: 'ci:table-add', href: '/home/' + $user.learn },
		{ title: i18n`文章`, icon: 'grommet-icons:article', href: '/article' },
		{ title: i18n`我的大脑`, icon: 'icon-park-outline:brain', href: '/brain' },
		{ title: i18n`设置`, icon: 'mingcute:settings-3-line', href: '/setting' },
	];
</script>

<menu
	class="fixed bottom-0 left-0 sm:bottom-auto sm:top-0 bg-transparent backdrop-blur-3xl flex flex-row sm:flex-col pb-4 justify-around sm:justify-start h-20 w-full sm:w-auto sm:h-full sm:p-4 sm:gap-8 sm:pt-8 border-t sm:border-t-0 sm:border-r bg-white sm:bg-transparent border-gray-100 sm:border-gray-200 items-center"
>
	{#each tabs as tab, index}
		<a
			href={tab.href}
			aria-label={tab.href}
			class={[
				`text-center`,
				selected === index ? 'text-primary-500 font-semibold' : 'text-gray-400',
			].join(' ')}
		>
			<iconify-icon width="2rem" icon={tab.icon} />
		</a>
	{/each}
</menu>
<div class="h-20" />
