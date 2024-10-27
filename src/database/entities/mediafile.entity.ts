import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { AvatarType } from '../../common/types/type';

@Entity({ name: 'mediafiles' })
export class Mediafile {
	@PrimaryColumn() id: string;

	@Column({ nullable: true })
	name: string;

	@Column({ name: 'key_name', nullable: true })
	keyName: string;

	@Column({ name: 'physical_path', nullable: true })
	physicalPath: string;

	@Column({ nullable: true, name: 'mime_type' })
	mimeType: string;

	@Column({ nullable: true })
	size: number;

	@Column({ nullable: true })
	extension: string;

	@Column({ nullable: true, type: 'jsonb' })
	variants: AvatarType;

	@Column({ nullable: true })
	status: number;

	@Column({ nullable: true })
	type: number;

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

	static createFromDto(createDto: Partial<Mediafile>): Mediafile {
		const data = new Mediafile();
		data.id = createDto.id;
		data.name = createDto.name;
		data.keyName = createDto.keyName;
		data.physicalPath = createDto.physicalPath;
		data.size = createDto.size;
		data.extension = createDto.extension;
		data.mimeType = createDto.mimeType;
		data.variants = createDto.variants;
		data.type = createDto.type;
		data.status = createDto.status;
		data.createdAt = createDto.createdAt;
		data.updatedAt = createDto.updatedAt;
		return data;
	}
}
