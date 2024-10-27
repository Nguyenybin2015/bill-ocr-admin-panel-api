import { Column, Entity, Index } from 'typeorm';
import { CustomBaseEntity } from '../../common/entity/custom-base.entity';

@Entity({ name: 'third_party_responses' })
export class ThirdPartyResponse extends CustomBaseEntity {
	@Column({
		name: 'transaction_id',
		nullable: true,
	})
	transactionId: number;

	@Column({
		name: 'member_id',
		nullable: true,
	})
	memberId: number;

	@Column({
		name: 'type',
		nullable: true,
	})
	@Index()
	type: number;

	@Column({
		name: 'status',
		nullable: true,
	})
	status: number;

	@Column({
		nullable: true,
		type: 'jsonb',
		default: {},
	})
	request: any;

	@Column({
		nullable: true,
		type: 'jsonb',
		default: {},
	})
	response: any;

	static createFromDto(data: Partial<ThirdPartyResponse>): ThirdPartyResponse {
		const result = new ThirdPartyResponse();
		result.type = data.type;
		result.request = data.request;
		result.response = data.response;
		result.transactionId = data.transactionId;
		return result;
	}
}
