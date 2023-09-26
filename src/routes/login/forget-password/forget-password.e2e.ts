import { i18n } from '$lib/i18n';
import { expect, test } from '@playwright/test';
import { e2eSignUp } from '../sign-up/sign-up.steup';

test('forget-password', async ({ page }) => {
	const { email, password } = await e2eSignUp(page);
	const newPassword = password + '1';
	await page.evaluate(() => window.sessionStorage.setItem('e2e', '1'));
	await page.getByLabel('/setting').click();
	page.on('dialog', (dialog) => dialog.accept());
	await page.getByLabel('logout button').click();

	await expect(page.getByLabel('check login title')).toBeVisible();
	await page.getByLabel('email input').fill(email);
	await page.getByLabel('next page').click();

	await page.getByLabel('goto forget password').click();

	await page.getByLabel('send code').click();
	await page.getByText(i18n`已发送邮件`).click();

	await page.getByLabel('password input').fill(newPassword);
	await page.getByLabel('code input').fill('999999');
	await page.getByLabel('change password').click();

	await page.getByText(i18n`密码修改成功`).click();

	await page.getByLabel('email input').fill(email);
	await page.getByLabel('next page').click();
	await page.getByLabel('password input').fill(newPassword);

	await page.getByLabel('sign in').click();

	await expect(page.getByLabel('home page section')).toBeVisible();
});
