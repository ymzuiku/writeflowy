import { config } from 'dotenv';
config();

export function getEnv(key: string) {
	return process.env[key] || '';
}
