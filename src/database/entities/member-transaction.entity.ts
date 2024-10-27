import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from '../../common/entity/custom-base.entity';

@Entity({ name: 'members_transactions' })
export class MemberTransaction extends CustomBaseEntity {
	@Column({ nullable: true, name: 'member_id' })
	memberId: number;

	@Column({
		nullable: true,
	})
	type: number;
}
