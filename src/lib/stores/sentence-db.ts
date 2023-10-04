import { NanoIndexed } from '$lib/helpers/nano-indexed';

export const sentenceDb = NanoIndexed({ dbName: 'sentenceDb', store: 'sentence' });
