import { config } from 'dotenv';
import nodemailer from 'nodemailer';
config();
interface Emailx {
	title: string;
	email: string;
	text: string;
	html?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _transport: any;
let user: string;
const getTransport = () => {
	if (!_transport) {
		const host = process.env['SMTP_HOST']!;
		const port = process.env['SMTP_PORT']!;
		user = process.env['SMTP_FROM']!;
		const pwd = process.env['SMTP_PWD']!;
		if (!host || !port || !user || !pwd) {
			throw new Error(`emailx not have host:${host}, port:${port}, user:${user}, pass`);
		}
		_transport = nodemailer.createTransport({
			host: host,
			port: Number(port),
			// secure: true,
			auth: {
				user: user,
				pass: pwd,
			},
		});
	}
	return _transport;
};

export const emailx = async (p: Emailx): Promise<string> => {
	const transporter = getTransport();
	const info = await transporter.sendMail({
		from: `${p.title} <${user}>`,
		to: p.email,
		subject: p.title,
		text: p.text,
		html: p.html || p.text,
	});

	return info.messageId;
};
