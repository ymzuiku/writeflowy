import { storable } from './storable';

export const sceneText = storable('scene-text', '');
export const paragraphText = storable('paragraph-text', '');
export const movieText = storable('movie-text', '');
export const movieTitle = storable('movie-title', '');
export const lastType = storable<'scene' | 'paragraph' | 'movie'>('last-type', 'scene');
