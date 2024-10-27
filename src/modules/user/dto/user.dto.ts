import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsBoolean,
	IsDate,
	IsEmail,
	IsEnum,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
} from 'class-validator';
import Enum from '../../../common/constants';
import { BaseFilter } from '../../../common/share/custom-base.filter';
import { ImagesType } from '../../../common/types/type';

export class GetListDto extends BaseFilter {
	@ApiProperty({ required: false })
	@Type(() => Number)
	@IsNumber()
	@IsOptional()
	id: number;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	name: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	email: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	phone: string;

	@ApiProperty({ required: false, enum: Enum.User.TYPE })
	@Type(() => Number)
	@IsEnum(Enum.User.TYPE)
	@IsOptional()
	type: number;

	@ApiProperty({ required: false, enum: Enum.User.STATUS })
	@Type(() => Number)
	@IsEnum(Enum.User.STATUS)
	@IsOptional()
	status: number;

	@ApiProperty({
		required: false,
	})
	@Transform(({ value }) => (value ? new Date(value) : null))
	@IsDate()
	@IsOptional()
	createdFrom: Date;

	@ApiProperty({
		required: false,
	})
	@Transform(({ value }) => (value ? new Date(value) : null))
	@IsDate()
	@IsOptional()
	createdTo: Date;

	@ApiProperty({ required: false, type: Boolean })
	@Transform(({ value }) => value === 'true')
	@IsBoolean()
	@IsOptional()
	download?: boolean;
}

export class CreateUserDto {
	@ApiProperty({ required: true })
	@IsString()
	name: string;

	@ApiProperty({ required: true, example: Enum.User.GENDER.MALE })
	@IsNumber()
	@IsEnum(Enum.User.GENDER)
	@IsOptional()
	gender: number;

	@ApiProperty({ required: true, example: '0386516874' })
	@IsString()
	phone: string;

	@ApiProperty({ required: true, example: Enum.User.STATUS.ACTIVE })
	@IsNumber()
	@IsEnum(Enum.User.STATUS)
	status: number;

	@ApiProperty({ required: true })
	@IsNumber()
	type: number;

	@ApiProperty({ required: true })
	@IsNumber()
	roleId: number;

	@ApiProperty({ required: true, example: 'a@gmail.com' })
	@IsEmail()
	email: string;

	@ApiProperty({ required: true, example: '123456a@' })
	@IsString()
	password: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	address: string;

	@ApiProperty({ required: false, example: { avatar: 'uuid' } })
	@IsObject()
	@IsOptional()
	images: Pick<ImagesType, 'avatar'>;
}

export class UpdateUserDto {
	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	name: string;

	@ApiProperty({ required: false, example: Enum.User.GENDER.MALE })
	@IsNumber()
	@IsEnum(Enum.User.GENDER)
	@IsOptional()
	gender: number;

	@ApiProperty({ required: false, example: '0386516874' })
	@IsString()
	@IsOptional()
	phone: string;

	@ApiProperty({ required: false, example: Enum.User.STATUS.ACTIVE })
	@IsOptional()
	@IsNumber()
	@IsEnum(Enum.User.STATUS)
	status: number;

	@ApiProperty({ required: false, example: 1 })
	@IsNumber()
	@IsOptional()
	type: number;

	@ApiProperty({ required: false, example: 'a@gmail.com' })
	@IsEmail()
	@IsOptional()
	email: string;

	@ApiProperty({ required: false, example: '123456a@' })
	@IsString()
	@IsOptional()
	password: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	address: string;

	@ApiProperty({ required: false, example: { avatar: 'uuid' } })
	@IsObject()
	@IsOptional()
	images: Pick<ImagesType, 'avatar'>;
}
