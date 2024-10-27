export enum STATUS {
	ACTIVE = 1,
	INACTIVE = -1,
}
export enum TYPE {
	GLOBAL = 1,
}

export const Mediafile = {
	STATUS: STATUS,
	TYPE: TYPE,
	SIZES: {
		THUMP: 240,
		RESOLUTIONS: [1080, 720, 480, 360, 240, 128, 'thumbnail'],
	},
};
