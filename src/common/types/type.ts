import { ObjectLiteral } from 'typeorm';

export type ResponsiveType =
	| 128
	| 240
	| 360
	| 480
	| 720
	| 1080
	| 'original'
	| 'thumbnail';

export type ImageDataType = {
	id: string;
	size: number;
};
export type AvatarType = Record<ResponsiveType, ImageDataType>;
export type Image360Type = {
	list?: AvatarType[] | string[];
	prefix?: string;
	count?: number;
	extension?: string;
};
export type ImagesType = {
	avatar: AvatarType | string;
	list: AvatarType[] | string[];
	banner: (AvatarType & { createdAt: string; status?: number }) | string;
	bannerStatus?: number;
	image360: Image360Type;
};
export type PropertiesDescription = {
	dosage: string;
	ingredient: string;
	usefulness: string;
	conservation: string;
};
export type DateFilter = { column: string; dateFrom: Date; dateTo: Date };
export type DetailRequestContact = {
	content: string;
};
export type Coordinates = {
	lat: number;
	long: number;
};
export type ColumnMapType<T> = {
	columnName: keyof T | ':index';
	keyValue: string;
	render?: (e: any, item?: T) => any;
};
export type NestedObjectType = {
	[key: string]: NestedObjectType | any; // Recursive definition to represent nested objects
};
export type JoinAndSelectParameters<T> = [
	property: string,
	alias: string,
	selectFields?: (keyof T)[],
	condition?: string,
	parameters?: ObjectLiteral,
];
// export type JoinParameters<T> = [
// 	property: string,
// 	alias: string,
// 	condition?: string,
// 	parameters?: ObjectLiteral,
// ];

export type CoordinatesHistoryType = {
	[key: number]: Coordinates;
};

export type TVersionManager = {
	version: string;
	description: string;
	require: boolean;
};
export type KeysWithoutType<Entity, ValueType> = {
	[K in keyof Entity]: Entity[K] extends ValueType ? never : K;
}[keyof Entity];

export type KeysWithType<Entity, ValueType> = {
	[K in keyof Entity]: Entity[K] extends ValueType ? K : never;
}[keyof Entity];

export type DeliveryInfoType = {
	name: string;
	phone: string;
	email?: string;
	address: string;
	cityId: number;
	cityName: string;
	districtId: number;
	districtName: string;
	wardId: number;
	wardName: string;
	cmnd: string;
};
export type responseSSOMicrosoft = {
	aud: string;
	iss: string;
	iat: number;
	nbf: number;
	exp: number;
	idp: string;
	name: string;
	oid: string;
	preferred_username: string;
	rh: string;
	sub: string;
	tid: string;
	uti: string;
	ver: string;
};
