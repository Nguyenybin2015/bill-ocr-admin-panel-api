export enum STATUS {
	INACTIVE = -1,
	ACTIVE = 1,
	PAUSED = -2,
	LOCKED = -3,
}
export enum TYPE {
	DEFAULT = 1,
}
export enum GENDER {
	MALE = 1,
	FEMALE = 2,
}

export enum STATUS_DESCRIPTION {
	'Chờ hoạt động' = -1,
	'Đang hoạt động' = 1,
	'Tạm ngưng' = -2,
	'Đã khóa' = -3,
}
export enum TYPE_DESCRIPTION {
	'Admin' = 1,
}

export const Member = {
	STATUS: STATUS,
	STATUS_DESCRIPTION: STATUS_DESCRIPTION,
	TYPE: TYPE,
	TYPE_DESCRIPTION: TYPE_DESCRIPTION,
	GENDER: GENDER,
};
