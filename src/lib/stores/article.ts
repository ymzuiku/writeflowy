import { indexed } from './indexed';

const baseArticle = `Interviewer: Good morning. Could you start by introducing yourself?
Interview Candidate: Good morning. My name is XYZ. I am a front-end engineer with 4 years
of experience in developing robust and user-friendly web applications. I specialize in using
JavaScript, CSS, HTML, and I have worked extensively with React.js and Vue.js frameworks.
Interviewer: That's great. Can you share an example of a project where you significantly
improved the performance?

`;

export const article = indexed('article', baseArticle);
export const translateSentence = indexed<Record<string, string>>('translateSentence', {});
