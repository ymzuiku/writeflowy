/* eslint-disable @typescript-eslint/no-explicit-any */
import { i18nSource } from './i18n-source';

let lastLang = '';
const langs: Record<string, string> = { zh: 'zh', en: 'en', jp: 'jp', es: 'es', fr: 'fr' };
export const languageList = [
	{ value: 'en', label: 'English' },
	{ value: 'zh', label: '中文' },
	{ value: 'jp', label: '日本語' },
	{ value: 'es', label: 'Español' },
	{ value: '', label: 'Français' },
];
const nofound = {
	zh: ' ',
	en: ' ',
	jp: ' ',
	es: ' ',
	fr: ' ',
};
export const getLanguage = () => {
	if (typeof window === 'undefined') {
		return 'en';
	}
	if (lastLang) {
		return lastLang;
	}
	let lng = localStorage.getItem('lang');
	if (!lng) {
		lng = (navigator.language || navigator.language).slice(0, 2).toLowerCase();
	}

	lastLang = langs[lng] || 'en';
	return lastLang;
};

export function i18nKey(str: string): string {
	return str;
}

function template(strings: any, ...values: any): string {
	let result = '';
	for (let i = 0; i < strings.length; i++) {
		result += strings[i];
		if (i < values.length) {
			result += values[i];
		}
	}
	return result;
}

export function i18n(strings: any, ...values: any): string {
	const result = template(strings, values);
	return ((i18nSource as any)[result] || nofound)[getLanguage()];
}

export function i18nFromKey(key: string) {
	const obj = (i18nSource as any)[key];
	if (!obj) {
		return key;
	}
	return obj[getLanguage()];
}

export function i18nObj(strings: any, ...values: any): Record<string, string> {
	const result = template(strings, values);
	return (i18nSource as any)[result] || nofound;
}

export function setLanguage(lng: 'zh' | 'en' | 'jp' | 'es') {
	if (typeof window === 'undefined') {
		return;
	}
	lastLang = lng;
	localStorage.setItem('lang', lng);
	location.reload();
}
