import { i18n } from '$lib/i18n';
import { expect, test } from '@playwright/test';
import { e2eSignUp } from './sign-up/sign-up.steup';

test('login', async ({ page }) => {
	const { email, password } = await e2eSignUp(page);

	await page.getByLabel('/setting').click();
	page.on('dialog', (dialog) => dialog.accept());
	await page.getByLabel('logout button').click();

	await expect(page.getByLabel('check login title')).toBeVisible();

	await page.getByLabel('email input').fill(email);
	await page.getByLabel('next page').click();

	await page.getByLabel('password input').fill(password + '1');

	await page.getByLabel('sign in').click();
	await page.getByText(i18n`邮箱或密码不正确`).click();

	await page.getByLabel('password input').fill(password);

	await page.getByLabel('sign in').click();
	await expect(page.getByLabel('home page section')).toBeVisible();
});
