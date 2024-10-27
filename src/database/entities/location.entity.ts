import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../../common/entity/custom-base.entity';

@Entity({ name: 'locations' })
export class Location extends CustomBaseEntity {
	@Column({ nullable: true })
	name: string;

	@Column({ nullable: true, name: 'parent_id' })
	parentId: number;

	@Column({ nullable: true })
	type: number;

	@Column({ default: {}, type: 'jsonb' })
	extra: object;

	@Column({ default: {}, type: 'jsonb' })
	logs: object;

	@Column({ nullable: true, name: 'area_id' })
	areaId: number;

	@Column({ nullable: true })
	key: string;

	@ManyToOne(() => Location, { createForeignKeyConstraints: false })
	@JoinColumn({ name: 'area_id' })
	area: Location;
}
