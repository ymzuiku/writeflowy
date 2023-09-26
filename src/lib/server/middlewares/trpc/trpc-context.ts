import type { RequestEvent } from '@sveltejs/kit';
import { initTRPC, type inferAsyncReturnType } from '@trpc/server';
import SuperJSON from 'superjson';

// we're not using the event parameter is this example,
// hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
	return {
		// context information
	};
}

type Context = inferAsyncReturnType<typeof createContext>;

export const t = initTRPC.context<Context>().create({
	transformer: SuperJSON,
});
