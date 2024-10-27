export interface MediafileVariantsInterface {
	'128'?: string;
	'240'?: string;
	'360'?: string;
	'720'?: string;
	'1080'?: string;
	thumbnail?: string;
}

export interface MediafileInterface {
	id: string;
	name: string;
	keyName?: string;
	physicalPath?: string;
	mimeType?: string;
	size?: number;
	extension: string;
	status?: number;
	type?: number;
	variants?: MediafileVariantsInterface;
}
