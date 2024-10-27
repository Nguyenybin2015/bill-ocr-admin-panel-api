import { Body, Controller, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ReqUser } from '../../common/decorators/user.decorator';
import { ErrorException } from '../../common/exceptions/error.exception';
import { setHeaderDownloadFile } from '../../common/helpers/helper';
import { User } from '../../database/entities';
import { CreateUserDto, GetListDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('v1/users')
@ApiBearerAuth()
export class UserController {
	constructor(private readonly userService: UserService) {}
	@Get('')
	async getList(
		@Query() getListDto: GetListDto,
		@Res() response: Response,
		@ReqUser() user: User,
	) {
		const data = await this.userService.getList(getListDto);
		if (getListDto.download) {
			const file = await this.userService.exportData(data.data, user);
			return setHeaderDownloadFile('users', file, response);
		}
		return response.send(data);
	}

	@Get('me')
	async getMe(@ReqUser() user: User) {
		const data = await this.userService.getOne(user.id);
		if (!data) {
			throw new ErrorException(404, 'Create User', 'User not found');
		}
		return data;
	}

	@Get(':id')
	async getDetail(@Param('id') id: number) {
		const data = await this.userService.getOne(id);
		return data;
	}

	@Post('')
	async create(@Body() createDto: CreateUserDto, @ReqUser() creator?: User) {
		const data = await this.userService.create(createDto, creator);
		return data;
	}

	@Put(':id')
	async update(
		@Body() updateDto: UpdateUserDto,
		@Param('id') id: number,
		@ReqUser() updater: User,
	) {
		const data = await this.userService.update(id, updateDto, updater);
		return data;
	}
}
