import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
	IsNumber,
	IsOptional,
	IsObject,
	Min,
	Max,
	IsEnum,
	IsBoolean,
} from 'class-validator';
import { SORT_ENUM } from '../enums/query.enum';
import { IQueryBuilder } from '../interfaces/query.interface';

export class BaseFilter {
	@ApiProperty({
		description: 'Skip one or many item ( Skip > 0 )',
		example: 1,
		required: false,
		default: 1,
	})
	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@Min(1)
	page: number;

	@ApiProperty({
		description: 'Take number of item in a page',
		example: 10,
		required: false,
		default: 2,
	})
	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@Min(1)
	@Max(100)
	perPage: number;

	@ApiProperty({
		description: 'Filter Fields',
		example: { name: '' },
		required: false,
	})
	@Transform(({ value }) => {
		try {
			return JSON.parse(value);
		} catch (err) {
			return false;
		}
	})
	@IsObject({
		message: 'Invalid filter',
	})
	@IsOptional()
	filter: IQueryBuilder;

	@ApiProperty({ enum: SORT_ENUM, required: false })
	@IsEnum(SORT_ENUM)
	@IsOptional()
	sort: SORT_ENUM;

	@ApiProperty({ required: false })
	@Transform(({ value }) => value == 'true')
	@IsBoolean()
	@IsOptional()
	getFull: boolean;
}
