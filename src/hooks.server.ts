import { createContext } from '$lib/server/middlewares/trpc/trpc-context';
import { router } from '$lib/server/middlewares/trpc/trpc-router';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = createTRPCHandle({ router, createContext, url: '/trpc' });
