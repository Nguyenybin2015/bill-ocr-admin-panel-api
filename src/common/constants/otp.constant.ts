export enum TYPE {
	REGISTER = 1,
	FORGOT_PASSWORD = 2,
}
const TYPE_DESCRIPTION: { [key: number]: string } = {
	[TYPE.REGISTER]: 'Đăng ký',
	[TYPE.FORGOT_PASSWORD]: 'Quên mật khẩu',
};

export enum STATUS {
	VERIFYING = 1,
	VERIFIED = 2,
	COMPLETE = 3,
}
const STATUS_DESCRIPTION: { [key: number]: string } = {
	[STATUS.VERIFYING]: 'Đang tiến hành',
	[STATUS.VERIFIED]: 'Đã xác nhận',
	[STATUS.COMPLETE]: 'Hoàn thành',
};

export const Otp = {
	TYPE: TYPE,
	TYPE_DESCRIPTION: TYPE_DESCRIPTION,
	STATUS: STATUS,
	STATUS_DESCRIPTION: STATUS_DESCRIPTION,
};
