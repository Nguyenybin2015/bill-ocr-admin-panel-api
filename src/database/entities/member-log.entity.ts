import { Column, Entity } from 'typeorm';
import { DataLog } from '../../common/entity/custom-base.entity';
import { Member } from './member.entity';

@Entity({ name: 'members_logs' })
export class MemberLog extends DataLog {
	@Column({
		name: 'creator_info',
		nullable: true,
		type: 'jsonb',
		default: {},
	})
	creatorInfo: Member;

	static createFromDto(data: Partial<MemberLog>, creator: Member): MemberLog {
		const result = new MemberLog();
		result.column = data.column;
		result.newData = data.newData;
		result.oldData = data.oldData;
		result.reason = data.reason;
		result.creatorInfo = creator || data.creatorInfo;
		return result;
	}
}
