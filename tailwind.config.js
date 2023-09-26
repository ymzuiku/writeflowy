import forms from '@tailwindcss/forms';
import nightwind from 'nightwind';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './src/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			boxShadow: {
				click: '0 0px 1px 0 rgb(0 0 0 / 0.05)',
				up: '0 -1px 2px 0 rgb(0 0 0 / 0.05)',
			},
			colors: {
				'root-bg': '#f8fafc',
				primary: {
					50: '#f5f3ff',
					100: '#ede9fe',
					200: '#ddd6fe',
					300: '#c4b5fd',
					400: '#a78bfa',
					500: '#8b5cf6',
					600: '#7c3aed',
					700: '#6d28d9',
					800: '#5b21b6',
					900: '#4c1d95',
					950: '#2e1065',
				},
			},
		},
	},
	plugins: [nightwind, forms],
};
