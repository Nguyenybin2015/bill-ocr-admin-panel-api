import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '.';
import { CustomBaseEntity } from '../../common/entity/custom-base.entity';

@Entity({ name: 'activities' })
export class Activity extends CustomBaseEntity {
	@Column({ nullable: true, name: 'user_id' })
	userId: number;

	@Column({ nullable: true, name: 'action_log_key' })
	actionLogKey: string;

	@Column({ nullable: true })
	content: string;

	@Column({ nullable: true })
	link: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	static createFromDto(createDto: Partial<Activity>): Activity {
		const data = new Activity();
		data.userId = createDto.userId;
		data.actionLogKey = createDto.actionLogKey;
		data.link = createDto.link;
		data.content = createDto.content;
		return data;
	}
}
