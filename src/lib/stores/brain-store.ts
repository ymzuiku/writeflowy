import { NanoIndexed } from '$lib/helpers/nano-indexed';
import { storable } from './storable';

export const memoryTap = storable('memory-tab', 'Step');
export const speechPeople = storable('speech-people', 'Matthew');
export const speedAudio = storable('speed-audio', 1);
export const loopPlay = storable('loop-play', false);
export const memoryListType = storable('memory-list-type', 'Today');
export const speechDb = NanoIndexed({
	dbName: 'speech',
	store: 'speech',
});

export const speeds = [0.5, 0.75, 1.0];

export const peopleList = [
	{ value: '', type: 'English', disabled: true },
	{ value: 'Matthew', type: 'Male' },
	{ value: 'Joey', type: 'Male' },
	{ value: 'Salli', type: 'Female' },
	{ value: 'Joanna', type: 'Female' },
	{ value: 'Kendra', type: 'Female' },
	{ value: 'Kimberly', type: 'Female' },
	{ value: 'Kevin', type: 'Female' },
	{ value: 'Ruth', type: 'Female' },
	{ value: '', type: 'español', disabled: true },
	{ value: 'Lupe', type: 'FeMale' },
	{ value: 'Pedro', type: 'Male' },
	{ value: '', type: '普通话', disabled: true },
	{ value: 'Zhiyu', type: 'FeMale' },
	{ value: 'Hiujin', type: 'Cantonese' },
	{ value: '', type: '日本語', disabled: true },
	{ value: 'Kazuha', type: 'FeMale' },
	{ value: 'Tomoko', type: 'FeMale' },
	{ value: 'Takumi', type: 'Male' },
	{ value: '', type: 'Français', disabled: true },
	{ value: 'Léa', type: 'FeMale' },
	{ value: 'Rémi', type: 'Male' },
	// { value: '', type: 'Child', disabled: true },
	// { value: 'Justin', type: 'Child' },
	// { value: 'Stephen', type: 'Male' },
	// { value: 'Kendra', type: 'Child' },
	// { value: 'Ivy', type: 'Child' },
	{ value: '', type: 'Indian', disabled: true },
	{ value: 'Kajal', type: 'Indian' },
];

// const zhPeopleList = [{ value: 'Zhiyu', type: 'FeMale' }];

// const esPeopleList = [
// 	{ value: 'Lupe', type: 'FeMale' },
// 	{ value: 'Pedro', type: 'Male' },
// ];

// const jpPeopleList = [
// 	{ value: 'Kazuha', type: 'FeMale' },
// 	{ value: 'Tomoko', type: 'FeMale' },
// 	{ value: 'Takumi', type: 'Male' },
// ];

// const frPeopleList = [
// 	{ value: 'Léa', type: 'FeMale' },
// 	{ value: 'Rémi', type: 'Male' },
// ];

// export const allPeopleList = {
// 	zh: zhPeopleList,
// 	en: enPeopleList,
// 	es: esPeopleList,
// 	jp: jpPeopleList,
// 	fr: frPeopleList,
// };

export const speedAudioList = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 2, 3];
