export enum STATUS {
	INACTIVE = -1,
	ACTIVE = 1,
	PAUSED = -2,
	LOCKED = -3,
}
export enum TYPE {
	USER = 1,
	MICROSOFT = 2,
}
export enum GENDER {
	MALE = 1,
	FEMALE = 2,
}

const STATUS_DESCRIPTION: { [key: number]: string } = {
	[STATUS.INACTIVE]: 'Chờ hoạt động',
	[STATUS.ACTIVE]: 'Đang hoạt động',
	[STATUS.PAUSED]: 'Tạm ngưng',
	[STATUS.LOCKED]: 'Đã khóa',
};
const TYPE_DESCRIPTION: { [key: number]: string } = {
	[TYPE.USER]: 'default',
	[TYPE.MICROSOFT]: 'microsoft',
};

export const User = {
	STATUS: STATUS,
	STATUS_DESCRIPTION: STATUS_DESCRIPTION,
	TYPE: TYPE,
	TYPE_DESCRIPTION: TYPE_DESCRIPTION,
	GENDER: GENDER,
};
