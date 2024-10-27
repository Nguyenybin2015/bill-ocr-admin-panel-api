import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Enum from '../../common/constants';
import { CustomBaseEntity } from '../../common/entity/custom-base.entity';
import { RbacModule } from './rbac-module.entity';
import { User } from './user.entity';

@Entity({ name: 'rbac_actions' })
export class RbacAction extends CustomBaseEntity {
	@Column({
		nullable: true,
	})
	key: string;

	@Column({ nullable: true })
	name: string;

	@Column({
		name: 'module_id',
		nullable: true,
	})
	moduleId: number;

	@Column({
		nullable: true,
		default: Enum.User.STATUS.ACTIVE,
	})
	status: number;

	@Column({
		nullable: true,
		default: Enum.User.TYPE.USER,
	})
	type: number;

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

	@ManyToOne(() => RbacModule)
	@JoinColumn({ name: 'module_id' })
	module: RbacModule;
}
