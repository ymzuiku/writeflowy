import { twMerge } from 'tailwind-merge';
const touch = twMerge(
	'active:shadow-click active:translate-y-[1px] transition-transform ease-in-out duration-100',
);
const button = twMerge(
	'flex sm:max-w-sm flex-row justify-center items-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
);

const deepButton = twMerge(
	'text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2',
);
const input = twMerge(
	'block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6',
);
const selectBlock = twMerge(
	'block cursor-pointer rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-0 bg-slate-50 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 hover:bg-gray-50',
);
const select = twMerge(
	'block cursor-pointer rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 bg-white hover:bg-gray-50',
);
const selectNone = twMerge(
	'pr-10 border-none focus:border-none focus:outline-none focus:ring-0 py-0',
);
const selectBox = twMerge(
	'text-left box-border bg-white p-4 border-none rounded-lg sm:hover:ring-primary-600 shadow-sm sm:hover:shadow-md sm:hover:ring-1 sm:hover:z-10',
	'flex flex-row items-center gap-0',
	'pr-0',
);
const floatBottom = twMerge(
	'sticky bottom-0 bg-root-bg p-4 border-t border-gray-100 border-solid flex flex-col justify-center items-center pb-10',
);
const card = twMerge(
	'text-left box-border bg-white p-4 border-none rounded-lg sm:hover:ring-primary-600 shadow-sm sm:hover:shadow-md sm:hover:ring-1 sm:hover:z-[1]',
	touch,
);

const miniCard = twMerge(card, 'h-10 w-10 flex flex-row justify-center items-center');

export const css = {
	touch,
	button,
	deepButton,
	input,
	selectBlock,
	select,
	selectNone,
	selectBox,
	floatBottom,
	card,
	miniCard,
};
