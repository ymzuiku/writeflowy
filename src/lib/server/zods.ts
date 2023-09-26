import { z } from 'zod';

export const zodAuth = z.object({
	email: z.string().email(),
	token: z.string().min(24),
});

export type Auth = z.infer<typeof zodAuth>;

export const zodLearn = z.enum(['en', 'zh', 'es', 'jp', 'fr']);
export type Learn = z.infer<typeof zodLearn>;
