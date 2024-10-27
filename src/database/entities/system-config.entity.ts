import { Column, Entity } from 'typeorm';
import Enum from '../../common/constants';
import { CustomBaseEntity } from '../../common/entity/custom-base.entity';

@Entity({ name: 'system_config' })
export class SystemConfig extends CustomBaseEntity {
  @Column({ nullable: true, type: 'jsonb' })
  data: Record<string, any>;

  @Column({ nullable: true, unique: true })
  type: number;

  @Column({ nullable: true, default: Enum.SystemConfig.STATUS.ACTIVE })
  status: number;

  static createFromDto(data: Partial<SystemConfig>): SystemConfig {
    const result = new SystemConfig();
    result.data = data.data;
    result.type = data.type;
    result.status = data.status;
    return result;
  }
}
