export enum STATUS {
	INACTIVE = -1,
	ACTIVE = 1,
}
const STATUS_DESCRIPTION: { [key: number]: string } = {
	[STATUS.INACTIVE]: 'Chờ hoạt động',
	[STATUS.ACTIVE]: 'Đang hoạt động',
};

export const RbacModule = {
	STATUS: STATUS,
	STATUS_DESCRIPTION: STATUS_DESCRIPTION,
};
