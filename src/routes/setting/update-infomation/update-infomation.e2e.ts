import test, { expect } from '@playwright/test';
import { e2eSignUp } from 'src/routes/login/sign-up/sign-up.steup';

test('update information', async ({ page }) => {
	await e2eSignUp(page);
	await page.getByLabel('/setting').click();
	await page.getByLabel('goto update-information').click();
	await expect(page.getByLabel('update infomation title')).toBeVisible();
	await page.getByLabel('name input').fill('dog dog');
	await page.getByLabel('submit button').click();
	await expect(page.getByLabel('setting page')).toBeVisible();
	await page.goto('/setting/update-infomation');
	await expect(async () => {
		expect(await page.getByLabel('name input').inputValue()).toBe('dog dog');
	}).toPass();
});
