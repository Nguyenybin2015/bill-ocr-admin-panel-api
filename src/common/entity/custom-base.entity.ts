import {
	BaseEntity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

/**
 * custom base entity
 */
export abstract class CustomBaseEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({
		name: 'created_at',
		type: 'timestamptz',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;

	@UpdateDateColumn({
		name: 'updated_at',
		type: 'timestamptz',
		default: () => 'CURRENT_TIMESTAMP',
		onUpdate: 'CURRENT_TIMESTAMP',
	})
	updatedAt: Date;
}

export abstract class DataLog {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({
		name: 'created_at',
		type: 'timestamptz',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;

	@UpdateDateColumn({
		name: 'updated_at',
		type: 'timestamptz',
		default: () => 'CURRENT_TIMESTAMP',
		onUpdate: 'CURRENT_TIMESTAMP',
	})
	updatedAt: Date;

	@Column({ nullable: true, name: 'object_id' })
	objectId: number;

	@Column({ nullable: true })
	reason: string;

	@Column({ nullable: true })
	column: string;

	@Column({
		name: 'old_data',
		nullable: true,
		type: 'jsonb',
		default: {},
	})
	oldData: object;

	@Column({
		name: 'new_data',
		nullable: true,
		type: 'jsonb',
		default: {},
	})
	newData: object;

	@Column({
		name: 'creator_info',
		nullable: true,
		type: 'jsonb',
		default: {},
	})
	creatorInfo: object;
}
