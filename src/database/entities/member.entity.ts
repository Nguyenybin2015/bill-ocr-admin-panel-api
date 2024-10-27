import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Enum from '../../common/constants';
import { CustomBaseEntity } from '../../common/entity/custom-base.entity';
import { DeliveryInfoType, ImagesType } from '../../common/types/type';
import { Location } from './location.entity';

@Entity({ name: 'members' })
export class Member extends CustomBaseEntity {
	@Column({ nullable: true })
	@Index({ fulltext: true })
	name: string;

	@Column({ nullable: true, name: 'guardian_name' })
	guardianName: string;

	@Column({ nullable: true, unique: true })
	@Index()
	phone: string;

	@Column({ nullable: true, select: false })
	password: string;

	@Column({ nullable: true })
	address: string;

	@Column({ nullable: true })
	cmnd: string;

	@Column({ nullable: true })
	email: string;

	@Column({ nullable: true })
	gender: number;

	@Column({ nullable: true, name: 'city_id' })
	cityId: number;

	@Column({ nullable: true, type: 'date' })
	birthday: Date;

	@Column({
		nullable: true,
		default: Enum.Member.STATUS.ACTIVE,
	})
	status: number;

	@Column({
		nullable: true,
		default: Enum.Member.TYPE.DEFAULT,
	})
	type: number;

	@Column({
		nullable: true,
		name: 'avatar_id',
	})
	avatarId: string;

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
		default: { app: '-' },
		select: false,
	})
	tokenInfo: { app: string };

	@ManyToOne(() => Location, { createForeignKeyConstraints: false })
	@JoinColumn({ name: 'city_id' })
	cityInfo: Location;

	static createFromDto(createDto: Partial<Member>): Member {
		const user = new Member();
		user.name = createDto.name;
		user.gender = createDto.gender;
		user.guardianName = createDto.guardianName;
		user.birthday = createDto.birthday;
		user.cityId = createDto.cityId;
		user.phone = createDto.phone;
		user.status = createDto.status;
		user.type = createDto.type;
		user.password = createDto.password;
		user.address = createDto.address;
		user.images = createDto.images;
		return user;
	}
}
