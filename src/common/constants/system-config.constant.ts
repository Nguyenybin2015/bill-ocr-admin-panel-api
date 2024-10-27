export enum TYPE {
	SYSTEM_INFORMATION = 1,
	SCAN_CODE_CONFIG = 2,
	THIRD_PARTY = 3,
	// RESPONSE_TOKEN_TOPUP = 4,
	RESPONSE_TOKEN = 5,
}
const TYPE_DESCRIPTION = {
	[TYPE.SYSTEM_INFORMATION]: 'Quản lý thông tin hệ thống',
	[TYPE.SCAN_CODE_CONFIG]: 'Quản lý nhập code',
};
export enum STATUS {
	ACTIVE = 1,
	INACTIVE = -1,
}
const STATUS_DESCRIPTION = {
	[STATUS.ACTIVE]: 'Hoạt đông',
	[STATUS.INACTIVE]: 'Ngưng hoạt động',
};
export enum SWITCH {
	ON = 1,
	OFF = -1,
}
export const SystemConfig = {
	STATUS,
	TYPE_DESCRIPTION,
	TYPE,
	STATUS_DESCRIPTION,
	SWITCH,
};
