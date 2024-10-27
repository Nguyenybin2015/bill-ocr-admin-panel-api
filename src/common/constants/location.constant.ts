export enum TYPE {
	AREA = 5,
	COUNTRY = 4,
	CITY = 3,
	DISTRICT = 2,
	WARD = 1,
}
export const TYPE_DESCRIPTION = {
	[TYPE.CITY]: 'Tỉnh/Thành phố',
	[TYPE.DISTRICT]: 'Quận/Huyện',
	[TYPE.WARD]: 'Xã/Phường',
	[TYPE.AREA]: 'Khu vực',
};

export enum LOCATION_KEY {
	vietnam = 'vietnam',
	thailand = 'thailand',
}
export const Location = {
	TYPE,
	TYPE_DESCRIPTION,
	LOCATION_KEY,
};
