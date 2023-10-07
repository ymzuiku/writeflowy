import { getEnv } from '$lib/helpers/get-env';

const unsplashURL = 'https://api.unsplash.com';
const unsplashSearchURL = unsplashURL + '/search/photos';

const unsplashAccessKey = getEnv('unsplash_access');

export async function searchImage(query: string) {
	const url = `${unsplashSearchURL}?query=${query}&page=1&per_page=3&orientation=landscape`;
	const res = await fetch(url, {
		method: 'GET',
		headers: { Authorization: 'Client-ID ' + unsplashAccessKey },
	}).then((v) => v.json());
	if (res?.results?.length) {
		return {
			image: res.results[0].urls?.regular,
			imageUserUrl: res.results[0].user?.links?.html,
		};
	}
	return null;
}
