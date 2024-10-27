import { Workbook, Worksheet } from 'exceljs';
import moment from 'moment';
import path from 'path';
import { cfg } from '../../config/env.config';
import { User } from '../../database/entities';
import { ColumnMapType } from '../types/type';
export class ExcelService {
	private workbook: Workbook;
	constructor() {
		this.workbook = new Workbook();
	}
	public async readFileTemplate(templateName: string) {
		await this.workbook.xlsx.readFile(path.join(cfg('DIR_TEMPLATE'), templateName)); // read file on folder template
		return this;
	}

	private findCellByValue(worksheet: Worksheet, searchValue: string) {
		let foundCell: {
			row?: number;
			column?: number;
			cellReference?: string;
		};

		worksheet.eachRow((row, rowNumber) => {
			row.eachCell((cell, colNumber) => {
				if (cell.value === searchValue) {
					foundCell = {
						row: rowNumber,
						column: colNumber,
						cellReference: cell.address,
					};
				}
			});
		});

		return foundCell;
	}
	/**
	 * This is a function that write info excel file
	 *
	 * @param {string | number} sheetIndexOrName - sheet name or index
	 * @param {User} user - người xuất file
	 * @param {string} link - Link xuất
	 * @param {Date} exportAt - Ngày xuất
	 */
	public writeInfo(
		sheetIndexOrName: string | number,
		user?: User,
		link?: string,
		exportAt?: Date,
	) {
		const worksheet = this.workbook.getWorksheet(sheetIndexOrName);
		if (user) {
			const cellUser = this.findCellByValue(worksheet, 'Data name');
			if (cellUser) {
				worksheet.getCell(cellUser.row, cellUser.column + 1).value = user.name;
			}
		}
		if (link) {
			const cellLink = this.findCellByValue(worksheet, 'Meaning');
			if (cellLink) {
				worksheet.getCell(cellLink.row, cellLink.column + 1).value = link;
			}
		}
		if (exportAt) {
			const cellExportAt = this.findCellByValue(worksheet, 'Example');
			if (cellExportAt) {
				worksheet.getCell(cellExportAt.row, cellExportAt.column + 1).value =
					moment(exportAt).format('DD-MM-YYYY HH:mm:ss');
			}
		}
	}

	/**
	 * This is a function that write the data to the excel file
	 *
	 * @param {string | number} sheetIndexOrName - sheet name or index
	 * @param {T[]} data - dữ liệu nhập vào
	 * @param {ColumnMapType[]} mapColumn - map giữa columns với data
	 */
	public writeData<TData>(
		sheetIndexOrName: string | number,
		data: TData[],
		mapColumn?: ColumnMapType<TData>[],
	) {
		const worksheet = this.workbook.getWorksheet(sheetIndexOrName);
		const detailColumns = mapColumn.map(item => {
			const cell = this.findCellByValue(worksheet, item.keyValue);
			if (!cell) {
				throw new Error(`Cell '${item.keyValue}' not found`);
			}
			return {
				...item,
				row: cell.row,
				column: cell.column,
				cellReference: cell.row,
			};
		});

		for (const [index, item] of data.entries()) {
			for (const mapItem of detailColumns) {
				mapItem.row++;
				const value =
					mapItem.columnName === ':index'
						? index + 1
						: item[mapItem.columnName];
				if (value !== undefined && value !== null) {
					worksheet.getCell(mapItem.row, mapItem.column).value = mapItem.render
						? mapItem.render(value, item)
						: value;
				}
			}
		}
		return this;
	}

	public async writeBuffer() {
		const buffer = await this.workbook.xlsx.writeBuffer();
		return buffer;
	}
}
