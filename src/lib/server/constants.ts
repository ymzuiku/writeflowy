import { getEnv } from '$lib/helpers/get-env';

export const SEND_REGISTER_EMAIL = 'send_register_email:';
export const SEND_FORGET_PASSWORD_EMAIL = 'send_forget_password_email:';
export const LOGIN_TOKEN = 'login_token:';
export const GETVIPDAYS = 'GETVIPDAYS:';
export const HOUR_ONE_FROM_SECOND = 60 * 60 * 24;
export const DAY_ONE_FROM_SECOND = HOUR_ONE_FROM_SECOND * 24;
export const DAY_7_FROM_SECOND = DAY_ONE_FROM_SECOND * 7;
export const DAY_15_FROM_SECOND = DAY_ONE_FROM_SECOND * 15;
export const SUCCESS = { ok: 1 };
export const DEV = !!process?.env?.DEV;
export const AWS_S3_SENTENCES = getEnv('AWS_S3_SENTENCES') || '';
