export enum STATUS {
	INACTIVE = -1,
	ACTIVE = 1,
}
const STATUS_DESCRIPTION: { [key: number]: string } = {
	[STATUS.INACTIVE]: 'Ngưng hoạt động',
	[STATUS.ACTIVE]: 'Hoạt động',
};
export const RbacRoleAction = {
	STATUS: STATUS,
	STATUS_DESCRIPTION,
};
