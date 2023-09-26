import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'bun run preview',
		port: 4173,
	},
	testDir: 'src',
	timeout: 5 * 1000,
	maxFailures: 1,
	fullyParallel: true,
	testMatch: /(.+\.)?(e2e)\.ts/,
	expect: {
		timeout: 3000,
	},
	workers: 9,
};

export default config;
