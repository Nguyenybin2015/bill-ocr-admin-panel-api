import { User } from '../../database/entities';

export type LogDataInfoType = {
	column: string;
	old: any;
	new: any;
};

export type LogDataType = {
	action: string;
	userId: number;
	user: User;
	reason?: string;
	loggedAt: string;
	updateInfo: LogDataInfoType[];
};
export type LogType = {
	list: LogDataType[];
	types: LogDataType[];
	statuses: LogDataType[];
	[key: string]: any; // Index signature
};
