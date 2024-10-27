export enum TYPE {
	SCAN_CODE = 1,
	TRADE = 2,
	SPIN = 3,
}
const TYPE_DESCRIPTION: { [key: number]: string } = {
	[TYPE.SCAN_CODE]: 'Nhập mã',
	[TYPE.TRADE]: 'Đổi quà',
	[TYPE.SPIN]: 'Vòng quay',
};

export const MemberTransaction = {
	TYPE,
	TYPE_DESCRIPTION,
};
