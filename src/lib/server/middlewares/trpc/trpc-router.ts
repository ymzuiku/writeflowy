import { addLikeAnalyze, zodAddLikeAnalyzeInput } from '$lib/server/like-analyze/add-like-analyze';
import {
	checkLikeAnalyze,
	zodCheckLikeAnalyzeInput,
} from '$lib/server/like-analyze/check-like-analyze';
import {
	listLikeAnalyze,
	zodListLikeAnalyzeInput,
} from '$lib/server/like-analyze/list-like-analyze';
import {
	removeLikeAnalyze,
	zodRemoveLikeAnalyzeInput,
} from '$lib/server/like-analyze/remove-like-analyze';
import { checkLogin, zodCheckLoginInput } from '$lib/server/login/check-login';
import { forgetPassword, zodForgetPasswordInput } from '$lib/server/login/forget-password';
import { login, zodLoginInput } from '$lib/server/login/login';
import {
	sendForgtpasswordEmail,
	zodSendForgtpasswordEmailInput,
} from '$lib/server/login/send-forget-password-email';
import { sendSignUpEmail, zodSendSignUpEmailInput } from '$lib/server/login/send-sign-up-email';
import { signUp, zodSignUpInput } from '$lib/server/login/sign-up';
import { token, zodTokenInput } from '$lib/server/login/token';
import { deleteMemory, zodDeleteMemoryInput } from '$lib/server/memory/delete-memory';
import { memorys, zodMemorysInput } from '$lib/server/memory/memorys';
import { updateMemory, zodUpdateMemoryInput } from '$lib/server/memory/update-memory';
import { getVipDays } from '$lib/server/order/get-vip-days';
import { removeSubscrib, zodRemoveSubscribInput } from '$lib/server/order/remove-subscribe';
import { addMemory, zodAddMemoryInput } from '$lib/server/sentence/add-memory';
import { analyze, zodAnalyzeInput } from '$lib/server/sentence/analyze';
import { analyzeMovie, zodAnalyzeMovieInput } from '$lib/server/sentence/analyze-movie';
import { getAnalyzes, zodGetAnalyzesInput } from '$lib/server/sentence/get-analyzes';
import { getSentence, zodGetSentenceInput } from '$lib/server/sentence/get-sentence';
import { sentence, zodSentenceInput } from '$lib/server/sentence/sentence';
import { updateInfomation, zodUpdateInfomationInput } from '$lib/server/setting/update-infomation';
import { zodAuth } from '$lib/server/zods';
import { t } from './trpc-context';

const input = t.procedure.input;

export const router = t.router({
	sendSignUpEmail: input(zodSendSignUpEmailInput).mutation((v) => sendSignUpEmail(v.input)),
	signUp: input(zodSignUpInput).mutation((v) => signUp(v.input)),
	checkLogin: input(zodCheckLoginInput).mutation((v) => checkLogin(v.input)),
	login: input(zodLoginInput).mutation((v) => login(v.input)),
	token: input(zodTokenInput).mutation((v) => token(v.input)),
	forgetPassword: input(zodForgetPasswordInput).mutation((v) => forgetPassword(v.input)),
	sendForgtpasswordEmail: input(zodSendForgtpasswordEmailInput).mutation((v) =>
		sendForgtpasswordEmail(v.input),
	),
	analyze: input(zodAnalyzeInput).query((v) => analyze(v.input)),
	analyzeMovie: input(zodAnalyzeMovieInput).mutation((v) => analyzeMovie(v.input)),
	getAnalyzes: input(zodGetAnalyzesInput).mutation((v) => getAnalyzes(v.input)),
	sentence: input(zodSentenceInput).mutation((v) => sentence(v.input)),
	getSentence: input(zodGetSentenceInput).query((v) => getSentence(v.input)),
	memorys: input(zodMemorysInput).mutation((v) => memorys(v.input)),
	updateMemory: input(zodUpdateMemoryInput).mutation((v) => updateMemory(v.input)),
	deleteMemory: input(zodDeleteMemoryInput).mutation((v) => deleteMemory(v.input)),
	updateInfomation: input(zodUpdateInfomationInput).mutation((v) => updateInfomation(v.input)),
	getVipDays: input(zodAuth).mutation((v) => getVipDays(v.input)),
	removeSubscrib: input(zodRemoveSubscribInput).mutation((v) => removeSubscrib(v.input)),
	listLikeAnalyze: input(zodListLikeAnalyzeInput).mutation((v) => listLikeAnalyze(v.input)),
	addLikeAnalyze: input(zodAddLikeAnalyzeInput).mutation((v) => addLikeAnalyze(v.input)),
	removeLikeAnalyze: input(zodRemoveLikeAnalyzeInput).mutation((v) => removeLikeAnalyze(v.input)),
	checkLikeAnalyze: input(zodCheckLikeAnalyzeInput).mutation((v) => checkLikeAnalyze(v.input)),
	addMemory: input(zodAddMemoryInput).mutation((v) => addMemory(v.input)),
});

export type Router = typeof router;
