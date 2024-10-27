import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from '../../common/entity/custom-base.entity';

@Entity({ name: 'activities_actions' })
export class ActivityAction extends CustomBaseEntity {
	@Column({ nullable: true, unique: true, name: 'action_log_key' })
	actionLogKey: string;

	@Column({ nullable: true, name: 'content' })
	content: string;

	static createFromDto(createDto: Partial<ActivityAction>): ActivityAction {
		const data = new ActivityAction();
		data.actionLogKey = createDto.actionLogKey;
		data.content = createDto.content;
		return data;
	}
}
