import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { DataSource, Repository } from 'typeorm';
import Enum from '../../common/constants';
import { ErrorException } from '../../common/exceptions/error.exception';
import { ExcelService } from '../../common/share/excel.service';
import {
	FilterBuilder,
	RenderLogBuilder,
	TransactionBuilder,
	UpdateBuilder,
} from '../../common/share/share.service';
import { ColumnMapType } from '../../common/types/type';
import { cfg } from '../../config/env.config';
import { User, UserLog } from '../../database/entities';
import { CreateUserDto, GetListDto, UpdateUserDto } from './dto/user.dto';
@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,

		@InjectRepository(UserLog)
		private userLogRepository: Repository<UserLog>,

		@InjectDataSource()
		private readonly dataSource: DataSource,
	) {}
	async getList(getListDto: GetListDto) {
		const entity = {
			entityRepo: this.userRepository,
			alias: 'user',
		};
		const filterBuilder = new FilterBuilder<User, GetListDto>(entity, getListDto)
			.andWhere('id')
			.andWhere('status')
			.andWhere('type')
			.andWhereUnAccentString('name')
			.andWhereUnAccentString('email')
			.andWhereUnAccentString('phone')
			.andWhereFromTo('createdAt', getListDto.createdFrom, getListDto.createdTo);

		if (getListDto.download) {
			filterBuilder.addPagination();
		}
		const [data, total] = await filterBuilder.queryBuilder.getManyAndCount();

		return {
			data: data,
			total: total,
		};
	}
	async getOne(id: number) {
		const data = await this.userRepository.findOneBy({ id: id });
		if (!data) {
			throw new ErrorException(404, 'Get Detail User', 'id not found');
		}
		return data;
	}
	async create(createDto: CreateUserDto, creator?: User) {
		const data = await this.userRepository.findOneBy({ email: createDto.email });
		if (data) {
			throw new ErrorException(409, 'Create User', 'Email existed');
		}
		const dataInsert = User.createFromDto(createDto);
		dataInsert.creatorId = creator?.id;
		dataInsert.creatorInfo = creator;
		dataInsert.password = this.hashPassword(dataInsert.password);

		const transactionBuilder = new TransactionBuilder(this.dataSource);
		await transactionBuilder.startTransaction();
		try {
			// insert data
			const user = await this.userRepository
				.createQueryBuilder('user', transactionBuilder.queryRunner)
				.insert()
				.values(dataInsert)
				.execute();
			const userId = user.identifiers[0].id;
			// write logs
			// commit transaction
			await transactionBuilder.commitTransaction();
			return {
				success: true,
				id: userId,
			};
		} catch (error) {
			await transactionBuilder.rollbackTransaction();
			throw new ErrorException(500, 'Create User', error.message);
		} finally {
			await transactionBuilder.release();
		}
	}
	async update(id: number, updateDto: UpdateUserDto, updater: User) {
		const user = await this.userRepository.findOneBy({ id: id });
		if (!user) {
			throw new ErrorException(404, 'Update User', 'id');
		}
		const renderLogBuilder = new RenderLogBuilder(this.userLogRepository, updater);

		const updateBuilder = new UpdateBuilder(user, updateDto, renderLogBuilder)
			.update('name')
			.update('gender')
			.update('phone')
			.update('status')
			.update('type')
			.update('email')
			.update('password')
			.update('address')
			.update('images');
		const dataUpdate = User.createFromDto(updateBuilder.dataUpdate);

		if (dataUpdate.password) {
			dataUpdate.password = this.hashPassword(dataUpdate.password);
			//logout user
			dataUpdate.loginInfo = {
				...user.loginInfo,
				crm: '-',
			};
		}
		const transactionBuilder = new TransactionBuilder(this.dataSource);
		await transactionBuilder.startTransaction();
		try {
			//create data
			await this.userRepository
				.createQueryBuilder('user', transactionBuilder.queryRunner)
				.update()
				.set(dataUpdate)
				.where({ id: id })
				.execute();
			//write logs
			await renderLogBuilder.insert(id, transactionBuilder.queryRunner);
			//commit transaction
			await transactionBuilder.commitTransaction();
			return {
				success: true,
				id: id,
			};
		} catch (error) {
			await transactionBuilder.commitTransaction();
		} finally {
			await transactionBuilder.release();
		}
	}
	public hashPassword(password: string) {
		return bcrypt.hashSync(password, cfg('BCRYPT_SALT_ROUND', Number));
	}
	async exportData(data: User[], user: User) {
		const mapColumn: ColumnMapType<User>[] = [
			{
				keyValue: 'ID',
				columnName: 'id',
			},
			{
				keyValue: 'Tên nhân viên',
				columnName: 'name',
			},
			{
				keyValue: 'Điện thoại',
				columnName: 'phone',
			},
			{
				keyValue: 'Email',
				columnName: 'email',
			},
			{
				keyValue: 'Ngày tạo',
				columnName: 'createdAt',
				render: (e: Date) => {
					return moment(e).format('DD-MM-YYYY HH:mm:ss');
				},
			},
			{
				keyValue: 'Trạng thái',
				columnName: 'status',
				render: (e: number) => {
					return Enum.User.STATUS_DESCRIPTION[e];
				},
			},
		];
		const excelService = new ExcelService();
		const fileExcel = await excelService.readFileTemplate('users.xlsx'); // filename in folder template
		fileExcel.writeInfo(
			1,
			user,
			`${cfg('APP_PUBLIC_ENDPOINT')}/v1/users`,
			new Date(),
		);
		fileExcel.writeData(1, data, mapColumn);

		return await fileExcel.writeBuffer();
	}
}
