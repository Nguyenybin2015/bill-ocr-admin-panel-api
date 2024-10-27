import { Column, Entity, Index } from 'typeorm';
import Enum from '../../common/constants';
import { CustomBaseEntity } from '../../common/entity/custom-base.entity';

@Entity({ name: 'otps' })
export class Otp extends CustomBaseEntity {
	@Column({ nullable: true })
	@Index()
	phone: string;

	@Column({ nullable: true })
	code: string;

	@Column({ nullable: true, type: 'jsonb', default: {} })
	token: {
		verifyToken?: string;
		processToken?: string;
	};

	@Column({ nullable: true })
	type: number;

	@Column({ nullable: true, default: Enum.Otp.STATUS.VERIFYING })
	status: number;

	@Column({ nullable: true })
	ip: string;

	static createFromDto(data: Partial<Otp>): Otp {
		const otp = new Otp();
		otp.code = data.code;
		otp.phone = data.phone;
		otp.type = data.type;
		otp.status = data.status;
		otp.token = data.token;
		return otp;
	}
}
