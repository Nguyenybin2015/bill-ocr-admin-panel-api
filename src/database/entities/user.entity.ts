import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import Enum from '../../common/constants';
import { CustomBaseEntity } from '../../common/entity/custom-base.entity';
import { ImagesType } from '../../common/types/type';

@Entity({ name: 'users' })
export class User extends CustomBaseEntity {
	@Column({ nullable: true })
	@Index({ fulltext: true })
	name: string;

	@Column({ nullable: true })
	@Index({ fulltext: true })
	email: string;

	@Column({ nullable: true })
	phone: string;

	@Column({ nullable: true, select: false })
	password: string;

	@Column({ nullable: true })
	address: string;

	@Column({ nullable: true })
	gender: number;

	@Column({ nullable: true })
	birthday: string;

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
		nullable: true,
		type: 'jsonb',
		default: {},
	})
	images: Pick<ImagesType, 'avatar'>;

	@Column({
		name: 'token_info',
		nullable: true,
		type: 'jsonb',
		default: {},
		select: false,
	})
	tokenInfo: { crm: string };

	@Column({
		name: 'login_info',
		nullable: true,
		type: 'jsonb',
		default: {},
		select: false,
	})
	loginInfo: any;

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

	static createFromDto(createDto: Partial<User>): User {
		const user = new User();
		user.name = createDto.name;
		user.gender = createDto.gender;
		user.phone = createDto.phone;
		user.status = createDto.status;
		user.type = createDto.type;
		user.email = createDto.email;
		user.password = createDto.password;
		user.address = createDto.address;
		user.images = createDto.images;

		return user;
	}
}
