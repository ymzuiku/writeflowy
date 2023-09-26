import { i18n } from '$lib/i18n';
import { faker } from '@faker-js/faker';
import { expect, type Page } from '@playwright/test';

// const accountFile = 'playwright/.auth/account.json';
const authFile = 'playwright/.auth/user.json';

export const e2eSignUp = async (page: Page) => {
	const email = faker.internet.email();

	const password = faker.internet.password();
	await page.goto('/');
	await page.evaluate(() => {
		window.localStorage.clear();
		window.sessionStorage.setItem('e2e', '1');
	});
	await page.goto('/');
	await page.getByLabel('email input').fill(email);
	await page.getByLabel('next page').click();
	// await expect(page.getByLabel('login title')).toBeVisible();
	// await page.getByLabel('goto sign-up').click();
	await expect(page.getByLabel('sign-up title')).toBeVisible();
	// await page.getByLabel('email input').fill(email);
	await page.getByLabel('password input').fill(password);
	await page.getByLabel('send code').click();
	await page.getByText(i18n`已发送邮件`).click();
	// await page.getByLabel('send code').click();
	// await page.getByText(i18n`你刚刚已发送过邮件，请查收邮箱`).click();
	await page.getByLabel('code input').fill('999999');
	await page.getByLabel('sign in').click();
	await page.getByText(i18n`注册成功`).click();

	await page.context().storageState({ path: authFile });
	// fs.writeFileSync(accountFile, JSON.stringify({ email, password }));

	return { email, password };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// let account: any = null;

// export function loadAccount(): { email: string; password: string } {
// 	if (account) {
// 		return account;
// 	}
// 	account = JSON.parse(fs.readFileSync(accountFile).toString());
// 	return account;
// }
