import { test as setup } from '@playwright/test';
import { e2eSignUp } from './sign-up.steup';

setup('sign-up setup', async ({ page }) => {
	await e2eSignUp(page);
});
