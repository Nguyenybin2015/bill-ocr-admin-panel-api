import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Enum from '../../common/constants';
import { CustomBaseEntity } from '../../common/entity/custom-base.entity';
import { User } from './user.entity';

@Entity({ name: 'rbac_modules' })
export class RbacModule extends CustomBaseEntity {
	@Column({
		nullable: true,
	})
	key: string;

	@Column({
		nullable: true,
	})
	name: string;

	@Column({
		nullable: true,
		default: Enum.User.STATUS.ACTIVE,
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
