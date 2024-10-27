import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import Enum from '../../common/constants';
import { CustomBaseEntity } from '../../common/entity/custom-base.entity';
import { User } from './user.entity';

@Entity({ name: 'rbac_roles' })
export class RbacRoles extends CustomBaseEntity {
	@Column({ nullable: true })
	@Index({ fulltext: true })
	name: string;

	@Column({
		nullable: true,
		default: Enum.RbacRole.STATUS.ACTIVE,
	})
	status: number;

	@Column({
		name: 'creator_id',
		nullable: true,
	})
	creatorId: number;

	@Column({
		name: 'creator_info',
		nullable: true,
		type: 'jsonb',
		default: {},
	})
	creatorInfo: User;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'creator_id' })
	creator: User;
}
