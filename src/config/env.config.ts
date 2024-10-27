import 'dotenv/config';

export const cfg = (key: string, parser: any = String) =>
	process.env[key] ? parser(process.env[key]) : undefined;
