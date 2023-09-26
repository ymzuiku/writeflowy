import { i18nFromKey } from '$lib/i18n';
import { toast } from '@zerodevx/svelte-toast';

const isBrowser = typeof window !== 'undefined';
function e2eToast(msg: string, error?: boolean) {
	if (isBrowser && sessionStorage.getItem('e2e') === '1') {
		const div = document.createElement('div');
		div.textContent = msg;
		div.style.cssText = `z-index:9000; cursor:pointer; position:fixed; right:10px; top:10px; height:auto; color:#fff; padding:10px; background:${
			error ? '#f00' : '#33f'
		};`;
		document.body.append(div);
		div.onclick = () => {
			div?.remove();
		};
		setTimeout(() => {
			div?.remove();
		}, 3000);
		return true;
	}
	return false;
}

function parseMsg(message: string | { message: string }) {
	let msg: string;
	if (typeof message === 'string') {
		msg = message;
	} else {
		msg = message.message;
	}
	return msg;
}

export function toastSuccess(message: string | { message: string }) {
	if (e2eToast(parseMsg(message))) {
		return;
	}
	toast.push(parseMsg(message), {
		theme: {
			'--toastColor': 'mintcream',
			'--toastBackground': '#7C3AED',
			'--toastBarBackground': '#00f',
		},

		pausable: true,
	});
}

export function toastError(message: string | { message: string }) {
	if (e2eToast(parseMsg(message), true)) {
		return;
	}
	toast.push(parseMsg(message), {
		theme: {
			'--toastColor': 'mintcream',
			'--toastBackground': 'rgba(233,60,60,0.98)',
			'--toastBarBackground': '#a00',
		},
		pausable: true,
	});
}

export function toastMessage(input: { message: string; status?: number }) {
	const isError = !!(input.status && input.status >= 400);
	if (e2eToast(i18nFromKey(input.message), isError)) {
		return;
	}
	if (isError) {
		toastError(i18nFromKey(input.message));
	} else {
		toastSuccess(i18nFromKey(input.message));
	}
}
