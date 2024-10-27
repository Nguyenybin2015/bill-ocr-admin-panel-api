import { Column, Entity } from 'typeorm';
import { DataLog } from '../../common/entity/custom-base.entity';
import { User } from './user.entity';

@Entity({ name: 'users_logs' })
export class UserLog extends DataLog {
	@Column({
		name: 'creator_info',
		nullable: true,
		type: 'jsonb',
		default: {},
	})
	creatorInfo: User;

	static createFromDto(data: Partial<UserLog>, creator: User): UserLog {
		const result = new UserLog();
		result.column = data.column;
		result.newData = data.newData;
		result.oldData = data.oldData;
		result.reason = data.reason;
		result.creatorInfo = creator || data.creatorInfo;
		return result;
	}
}
