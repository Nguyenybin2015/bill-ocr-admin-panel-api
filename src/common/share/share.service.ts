import _ from 'lodash';
import {
	DataSource,
	ObjectLiteral,
	QueryRunner,
	Repository,
	SelectQueryBuilder,
} from 'typeorm';
import { User } from '../../database/entities';
import { DataLog } from '../entity/custom-base.entity';
import { KeysWithType } from '../types/type';
import { BaseFilter } from './custom-base.filter';

export class FilterBuilder<
	T,
	TQuery extends Partial<BaseFilter & T> = Partial<BaseFilter & T>,
> {
	private count = 0;
	private entityName: string;
	public queryBuilder: SelectQueryBuilder<T>;
	private query: Partial<TQuery> = {};
	constructor(
		entity: { entityRepo: Repository<T>; alias: string; selectFields?: string[] },
		query?: TQuery,
	) {
		if (entity) {
			this.entityName = entity.alias;
			this.query = query || {};
			const selected = entity.selectFields?.length
				? entity.selectFields.map(field => `${entity.alias}.${field}`)
				: [entity.alias];
			this.queryBuilder = entity.entityRepo
				.createQueryBuilder(entity.alias)
				.select(selected);
		}
	}
	private getParam() {
		this.count++;
		return '_' + String(this.count);
	}
	leftJoin(
		property: string,
		alias: string,
		condition?: string,
		parameters?: ObjectLiteral,
	) {
		this.queryBuilder.leftJoin(property, alias, condition, parameters);
		return this;
	}
	innerJoin(
		property: string,
		alias: string,
		condition?: string,
		parameters?: ObjectLiteral,
	) {
		this.queryBuilder.innerJoin(property, alias, condition, parameters);
		return this;
	}
	leftJoinAndSelect<EntityRelation = T>(
		property: string,
		alias: string,
		selectFields?: (keyof EntityRelation)[],
		condition?: string,
		parameters?: ObjectLiteral,
	) {
		this.queryBuilder.leftJoin(property, alias, condition, parameters);
		this.addSelect(selectFields, alias);
		return this;
	}
	innerJoinAndSelect<EntityRelation = T>(
		property: string,
		alias: string,
		selectFields?: (keyof EntityRelation)[],
		condition?: string,
		parameters?: ObjectLiteral,
	) {
		this.queryBuilder.innerJoin(property, alias, condition, parameters);
		this.addSelect(selectFields, alias);
		return this;
	}
	addSelect<EntityRelation = T>(selectFields: (keyof EntityRelation)[], alias: string) {
		const selection = selectFields?.length
			? selectFields.map(field => `${alias}.${field as string}`)
			: [alias];
		this.queryBuilder.addSelect(selection);
		return this;
	}
	addSelectRaw<EntityRelation = T>(
		columns: ([keyof EntityRelation, string?] | keyof EntityRelation)[],
		alias: string,
	) {
		for (const column of columns) {
			const [columnName, columnMap] = Array.isArray(column)
				? column
				: [column, column];
			console.log(column, columnName, columnMap);

			this.queryBuilder.addSelect(
				`${alias}.${columnMap as string}`,
				columnName as string,
			);
		}
		return this;
	}
	andWhere<EntityRelation = T, ValueType = string>(
		name: keyof EntityRelation,
		cValue?: ValueType,
		entityName = this.entityName,
	): this {
		const propertyName = String(name);
		const paramsName = this.getParam();
		const value = arguments.length === 1 ? this.query[name as keyof TQuery] : cValue;
		const conditionColumn = `${entityName}.${propertyName}`;
		if (value) {
			this.queryBuilder.andWhere(`${conditionColumn} =  :${paramsName}`, {
				[paramsName]: value,
			});
		}
		return this;
	}
	andWhereNot<EntityRelation = T, ValueType = string>(
		name: keyof EntityRelation,
		cValue?: ValueType,
		entityName = this.entityName,
	): this {
		const propertyName = String(name);
		const paramsName = this.getParam();
		const value = arguments.length === 1 ? this.query[name as keyof TQuery] : cValue;
		const conditionColumn = `${entityName}.${propertyName}`;

		if (value) {
			this.queryBuilder.andWhere(`${conditionColumn} !=  :${paramsName}`, {
				[paramsName]: value,
			});
		}
		return this;
	}

	andWhereIn<EntityRelation = T, ValueType = string>(
		name: keyof EntityRelation,
		array: ValueType[] = [],
		entityName = this.entityName,
	): this {
		const propertyName = String(name);
		const paramsName = this.getParam();
		const value = arguments.length === 1 ? this.query[name as keyof TQuery] : array;
		const conditionColumn = `${entityName}.${propertyName}`;
		if (array.length > 0) {
			this.queryBuilder.andWhere(`${conditionColumn} IN (:...${paramsName})`, {
				[paramsName]: value,
			});
		}
		return this;
	}

	andWhereNotIn<EntityRelation = T, ValueType = string>(
		name: keyof EntityRelation,
		array: ValueType[] = [],
		entityName = this.entityName,
	): this {
		const propertyName = String(name);
		const paramsName = this.getParam();
		const value = arguments.length === 1 ? this.query[name as keyof TQuery] : array;
		const conditionColumn = `${entityName}.${propertyName}`;
		if (array.length > 0) {
			this.queryBuilder.andWhere(`${conditionColumn} NOT IN (:...${paramsName})`, {
				[paramsName]: value,
			});
		}
		return this;
	}
	andWhereLikeString<EntityRelation = T>(
		name: keyof EntityRelation,
		valueString?: string,
		entityName = this.entityName,
	): this {
		const propertyName = String(name);
		const paramsName = this.getParam();
		const value =
			arguments.length === 1 ? this.query[name as keyof TQuery] : valueString;
		const conditionColumn = `${entityName}.${propertyName}`;
		if (value) {
			this.queryBuilder.andWhere(`${conditionColumn} ILIKE ${paramsName}`, {
				[paramsName]: `%${value}%`,
			});
		}
		return this;
	}
	andWhereUnAccentString<EntityRelation = T>(
		name: KeysWithType<EntityRelation, string>,
		valueString?: string,
		entityName: string = this.entityName,
	): this {
		const propertyName = String(name);
		const value =
			arguments.length === 1 ? this.query[name as keyof TQuery] : valueString;
		const paramsName = this.getParam();
		const conditionColumn = `${entityName}.${propertyName}`;

		if (value) {
			this.queryBuilder.andWhere(
				`unaccent(LOWER(${conditionColumn})) ILIKE unaccent(LOWER(:${paramsName}))`,
				{
					[`${paramsName}`]: `%${value}%`,
				},
			);
		}
		return this;
	}
	/**
	 * @deprecated
	 */
	andWhereDate<EntityRelation = T>(
		dateName: keyof EntityRelation,
		startDateName: keyof TQuery,
		endDateName: keyof TQuery,
		startDateValue: Date = undefined,
		endDateValue: Date = undefined,
		entityName: string = this.entityName,
	): this {
		const propertyName = String(dateName);
		const startDate = startDateValue || this.query[startDateName];
		const endDate = endDateValue || this.query[endDateName];
		const paramStartDate = this.getParam();
		const paramEndDate = this.getParam();
		const conditionColumn = `${entityName}.${propertyName}`;

		if (startDate) {
			this.queryBuilder.andWhere(
				`DATE(${conditionColumn}) >= DATE(:${paramStartDate})`,
				{
					[paramStartDate]: startDate,
				},
			);
		}
		if (endDate) {
			this.queryBuilder.andWhere(
				`DATE(${conditionColumn}) <= DATE(:${paramEndDate})`,
				{
					[paramEndDate]: endDate,
				},
			);
		}

		return this;
	}
	andWhereFromTo<EntityRelation = T, ValueType = number>(
		columnName: keyof EntityRelation,
		startValue?: ValueType,
		endValue?: ValueType,
		entityName: string = this.entityName,
	): this {
		const propertyName = String(columnName);
		const start = startValue;
		const end = endValue;
		const paramStart = this.getParam();
		const paramEnd = this.getParam();
		const conditionColumn = `${entityName}.${propertyName}`;

		if (start) {
			this.queryBuilder.andWhere(`${conditionColumn} >= :${paramStart}`, {
				[paramStart]: start,
			});
		}
		if (end) {
			this.queryBuilder.andWhere(`${conditionColumn} <= :${paramEnd}`, {
				[paramEnd]: end,
			});
		}

		return this;
	}
	andWhereGt<EntityRelation = T, ValueType = number>(
		columnName: keyof EntityRelation,
		startValue?: ValueType,
		entityName: string = this.entityName,
	): this {
		const propertyName = String(columnName);
		const start = startValue;
		const paramStart = this.getParam();
		const conditionColumn = `${entityName}.${propertyName}`;

		if (start) {
			this.queryBuilder.andWhere(`${conditionColumn} > :${paramStart}`, {
				[paramStart]: start,
			});
		}
		return this;
	}
	andWhereLt<EntityRelation = T, ValueType = number>(
		columnName: keyof EntityRelation,
		endValue?: ValueType,
		entityName: string = this.entityName,
	): this {
		const propertyName = String(columnName);
		const end = endValue;
		const paramEnd = this.getParam();
		const conditionColumn = `${entityName}.${propertyName}`;

		if (end) {
			this.queryBuilder.andWhere(`${conditionColumn} < :${paramEnd}`, {
				[paramEnd]: end,
			});
		}
		return this;
	}
	andWhereGte<EntityRelation = T, ValueType = number>(
		columnName: keyof EntityRelation,
		startValue?: ValueType,
		entityName: string = this.entityName,
	): this {
		const propertyName = String(columnName);
		const start = startValue;
		const paramStart = this.getParam();
		const conditionColumn = `${entityName}.${propertyName}`;

		if (start) {
			this.queryBuilder.andWhere(`${conditionColumn} >= :${paramStart}`, {
				[paramStart]: start,
			});
		}
		return this;
	}
	andWhereLte<EntityRelation = T, ValueType = number>(
		columnName: keyof EntityRelation,
		endValue?: ValueType,
		entityName: string = this.entityName,
	): this {
		const propertyName = String(columnName);
		const end = endValue;
		const paramEnd = this.getParam();
		const conditionColumn = `${entityName}.${propertyName}`;

		if (end) {
			this.queryBuilder.andWhere(`${conditionColumn} <= :${paramEnd}`, {
				[paramEnd]: end,
			});
		}
		return this;
	}
	addPagination(page?: number, perPage?: number, getFull?: boolean): this {
		const limit = perPage || this.query?.perPage || 10;
		const offset = (page - 1 || this.query?.page - 1 || 0) * limit;
		const isdPagination = getFull || this.query?.getFull || false;

		if (!isdPagination) {
			this.queryBuilder.skip(offset).take(limit);
		}
		return this;
	}
	orderBy(name: keyof T, order?: 'DESC' | 'ASC', entityName = this.entityName): this {
		const propertyName = String(name);
		this.queryBuilder.orderBy(
			`${entityName}.${propertyName}`,
			order || this.query.sort || 'DESC',
		);
		return this;
	}
	addOrderBy(
		name: keyof T,
		order?: 'DESC' | 'ASC',
		entityName = this.entityName,
	): this {
		const propertyName = String(name);
		this.queryBuilder.addOrderBy(
			`${entityName}.${propertyName}`,
			order || this.query.sort || 'DESC',
		);
		return this;
	}
	//filter in jsonb
	andWhereJsonb<ValueType, EntityRelation = T>(
		name: keyof EntityRelation,
		propertyJsonName: string,
		cValue: ValueType,
		entityName = this.entityName,
	): this {
		const propertyName = String(name);
		const paramsName = this.getParam();
		const value = cValue;
		const conditionColumn = `${entityName}.${propertyName}`;

		if (value) {
			this.queryBuilder.andWhere(
				`${conditionColumn} ->> '${propertyJsonName}' =  :${paramsName}`,
				{
					[paramsName]: value,
				},
			);
		}
		return this;
	}
	andWhereUnAccentStringJsonb<EntityRelation = T>(
		name: keyof EntityRelation,
		propertyJsonName: string,
		valueString: string,
		entityName: string = this.entityName,
	): this {
		const propertyName = String(name);
		const value = valueString;
		const paramsName = this.getParam();
		const conditionColumn = `${entityName}.${propertyName}`;

		if (value) {
			this.queryBuilder.andWhere(
				`unaccent(LOWER(${conditionColumn} ->> '${propertyJsonName}' )) ILIKE unaccent(LOWER(:${paramsName}))`,
				{
					[`${paramsName}`]: `%${value}%`,
				},
			);
		}
		return this;
	}
	andWhereFromToJsonb<EntityRelation = T, ValueType = number>(
		name: keyof EntityRelation,
		propertyJsonName: string,
		startValue: ValueType,
		endValue: ValueType,
		entityName: string = this.entityName,
	): this {
		const propertyName = String(name);
		const start = startValue;
		const end = endValue;
		const paramStart = this.getParam();
		const paramEnd = this.getParam();
		const conditionColumn = `${entityName}.${propertyName}`;

		if (start) {
			this.queryBuilder.andWhere(
				`${conditionColumn} ->> '${propertyJsonName}' >= :${paramStart}`,
				{
					[paramStart]: start,
				},
			);
		}
		if (end) {
			this.queryBuilder.andWhere(
				`${conditionColumn} ->> '${propertyJsonName}' <= :${paramEnd}`,
				{
					[paramEnd]: end,
				},
			);
		}

		return this;
	}
	/**
	 *
	 * @param {keyof EntityRelation} name
	 * @param {boolean} cValue  true: IS NULL, false: IS NOT NULL
	 * @param entityName
	 * @returns
	 */
	andWhereNull<EntityRelation = T>(
		name: keyof EntityRelation,
		cValue: boolean,
		entityName = this.entityName,
	): this {
		const propertyName = String(name);
		const conditionColumn = `${entityName}.${propertyName}`;
		const value = cValue;
		if (value !== undefined) {
			this.queryBuilder.andWhere(
				`${conditionColumn} ${value ? 'IS NULL' : 'IS NOT NULL'}`,
			);
		}
		return this;
	}
}
export class RenderLogBuilder<EntityLog extends DataLog> {
	private user: User;
	private logs: Partial<EntityLog>[] = [];
	private dataLogRepository: Repository<EntityLog>;
	constructor(dataLogRepository: Repository<EntityLog>, user: User) {
		this.dataLogRepository = dataLogRepository;
		this.user = user;
	}
	public addLog(column: string, oldData: any, newData: any, reason?: string) {
		const log: Partial<EntityLog> = {
			column: column,
			oldData: oldData,
			newData: newData,
			reason: reason,
		} as Partial<EntityLog>;
		this.logs.push(log);
		return this;
	}
	public async insert(objectId: number, queryRunner?: QueryRunner) {
		if (this.logs.length) {
			const dataInsert = this.logs.map(log => {
				log.objectId = objectId;
				return log;
			});
			await this.dataLogRepository
				.createQueryBuilder('dataLog', queryRunner)
				.insert()
				.values(dataInsert as any)
				.execute();
		}
	}
}
export class UpdateBuilder<T, EntityLog extends DataLog> {
	public dataUpdate: Partial<T> = {};
	private newData: Partial<T>;
	private oldData: T;
	public renderLogBuilder: RenderLogBuilder<EntityLog>;

	constructor(
		oldData: T,
		newData: Partial<T>,
		renderLogBuilder: RenderLogBuilder<EntityLog>,
	) {
		this.oldData = oldData;
		this.newData = newData;
		this.renderLogBuilder = renderLogBuilder;
	}
	update(nameColumn: keyof T, options: { logging: boolean } = { logging: true }): this {
		if (
			this.newData[nameColumn] !== undefined &&
			!_.isEqual(this.newData[nameColumn], this.oldData[nameColumn])
		) {
			this.dataUpdate[nameColumn] = this.newData[nameColumn];
			if (options.logging) {
				this.renderLogBuilder.addLog(
					String(nameColumn),
					this.oldData[nameColumn],
					this.newData[nameColumn],
				);
			}
		}

		return this;
	}
	updateJsonb(nameColumn: keyof T): this {
		if (
			!this.dataUpdate[nameColumn] &&
			this.newData[nameColumn] &&
			Object.keys(this.newData[nameColumn]).length
		) {
			const value = {
				...this.oldData[nameColumn],
				...this.newData[nameColumn],
			};

			this.dataUpdate[nameColumn] = value;
		}

		this.renderLogBuilder.addLog(String(nameColumn), this.oldData[nameColumn], {
			...this.oldData[nameColumn],
			...this.newData[nameColumn],
		});
		return this;
	}
	updateWithValue(
		nameColumn: keyof T,
		value: T[keyof T],
		options: { logging: boolean } = { logging: true },
	): this {
		if (value !== undefined && value !== this.oldData[nameColumn]) {
			this.dataUpdate[nameColumn] = value;
			if (options.logging) {
				this.renderLogBuilder.addLog(
					String(nameColumn),
					this.oldData[nameColumn],
					value,
				);
			}
		}

		return this;
	}
}

export class TransactionBuilder {
	private processes: Promise<any>[] = [];
	private dataSource: DataSource;
	public queryRunner: QueryRunner;
	constructor(dataSource?: DataSource) {
		this.dataSource = dataSource;
	}
	async startTransaction() {
		this.queryRunner = this.dataSource.createQueryRunner();
		await this.queryRunner.connect();
		await this.queryRunner.startTransaction();
		return this;
	}
	async commitTransaction() {
		await this.queryRunner.commitTransaction();
		return this;
	}
	async rollbackTransaction() {
		await this.queryRunner.rollbackTransaction();
		return this;
	}
	async release() {
		await this.queryRunner.release();
		return this;
	}
	addProcess(process: Promise<any>) {
		this.processes.push(process);
		return this;
	}

	clearProcess() {
		this.processes = [];
		return this;
	}
	async runProcess() {
		const data = await Promise.all(this.processes);
		this.clearProcess();
		return data;
	}
}
