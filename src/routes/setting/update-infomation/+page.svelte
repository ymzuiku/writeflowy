<script lang="ts">
	import { css } from '$lib/components/atom-css';
	import FieldInput from '$lib/components/field-input.svelte';
	import Goback from '$lib/components/goback.svelte';
	import { catcher } from '$lib/helpers/catcher';
	import { toastMessage } from '$lib/helpers/toast';
	import { i18n } from '$lib/i18n';
	import { user } from '$lib/stores/user';
	import { trpc } from '$lib/trpc-client';

	let name = $user.name || 'John Doe';
	let occupation = $user.occupation || 'Software Engineer';
	let years_of_experience = $user.years_of_experience || 0;
	let skills = $user.skills || 'JavaScript, React, Node.js, SQL';
	let education = $user.education || 'Bachelor of Science in Computer Science';
	let address = $user.address || '123 Main Street, City, Country';
	let target_position = $user.target_position || 'Senior Software Engineer';
	let current_company = $user.current_company || 'TechCorp Inc.';
	let desired_company = $user.desired_company || 'InnovateTech Solutions';
	let personal_intro =
		$user.personal_intro ||
		'I am a passionate software engineer with a strong background in web development. I enjoy solving complex problems and building innovative solutions. My goal is to work with a forward-thinking company where I can contribute to exciting projects and continue to grow as a developer.';

	async function submit() {
		const nextData = {
			name,
			occupation,
			years_of_experience: Number(years_of_experience),
			skills,
			education,
			address,
			target_position,
			current_company,
			desired_company,
			personal_intro,
		};
		const res = await catcher(
			trpc.updateInfomation.mutate({
				auth: user.getAuth(),
				data: nextData,
			}),
		);
		if ('rejected' in res) {
			toastMessage(res);
			return;
		}
		user.update((v) => {
			return { ...v, ...nextData };
		});
		history.back();
	}
</script>

<Goback>
	<button aria-label="submit button" class={css.button} on:click={submit}>{i18n`Save`}</button>
</Goback>
<div class="p-4">
	<h2 aria-label="update infomation title" class="text-xl font-semibold">
		{i18n`完善你的个人资料`}
	</h2>
	<p class="text-sm text-gray-400 mt-2">
		{i18n`你不需要填写真实的信息，这部分仅仅用在 AI 会在你的场景对话中作答的参考`}
	</p>
	<form class="flex flex-col gap-4 mt-4" on:submit|preventDefault={submit}>
		<FieldInput weakTitle bind:value={name} id={'name'} title={i18n`name`} />
		<FieldInput weakTitle bind:value={occupation} id={'occupation'} title={i18n`Occupation`} />
		<FieldInput
			weakTitle
			bind:value={years_of_experience}
			id={'years_of_experience'}
			title={i18n`Years of experience`}
		/>
		<FieldInput weakTitle bind:value={skills} id={'skills'} title={i18n`Skills`} />
		<FieldInput weakTitle bind:value={education} id={'education'} title={i18n`Education`} />
		<FieldInput weakTitle bind:value={address} id={'address'} title={i18n`education`} />
		<FieldInput
			weakTitle
			bind:value={target_position}
			id={'target_position'}
			title={i18n`Target position`}
		/>
		<FieldInput
			weakTitle
			bind:value={current_company}
			id={'current_company'}
			title={i18n`Current company`}
		/>
		<FieldInput
			weakTitle
			bind:value={desired_company}
			id={'desired_company'}
			title={i18n`Desired company`}
		/>
		<FieldInput
			weakTitle
			bind:value={personal_intro}
			id={'dpersonal_intro'}
			title={i18n`Personal intro`}
		/>
		<div class="h-20" />
	</form>
</div>
