import { getEnv } from '$lib/helpers/get-env';
import AWS from 'aws-sdk';

export const s3 = new AWS.S3({
	accessKeyId: getEnv('AWS_ACCESS_KEY_ID'),
	secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY'),
	region: getEnv('AWS_REGION'),
});
