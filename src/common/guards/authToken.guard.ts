import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import moment from 'moment';
import { Repository } from 'typeorm';
import { cfg } from '../../config/env.config';
import { User } from '../../database/entities';
import { Logger } from '../../logger/logger.service';
import { ErrorException } from '../exceptions/error.exception';

@Injectable()
export class AuthTokenGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private reflector: Reflector,
		private readonly logger: Logger,

		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			this.logger.error(`[authentication] - Not found token`);
			throw new ErrorException(
				HttpStatus.UNAUTHORIZED,
				'AuthGuard',
				'Not found token',
			);
		}
		try {
			const payload = await this.jwtService.decode(token);
			console.log(payload);

			if (!payload) {
				throw new ErrorException(
					HttpStatus.UNAUTHORIZED,
					'Authentication Error',
					'payload',
				);
			}
			if (payload.tid !== cfg('TENANT_ID')) {
				throw new ErrorException(
					HttpStatus.UNAUTHORIZED,
					'Authentication Error',
					'payload',
				);
			}
			if (payload.exp < moment().unix())
				throw new ErrorException(
					HttpStatus.UNAUTHORIZED,
					'Authentication Error',
					'payload ',
					'time',
				);

			request['user'] = payload;
		} catch (error) {
			console.log(error);

			this.logger.error(
				`[authentication] # Authentication Error # ${
					error.response?.details || error.message
				}`,
			);
			throw new ErrorException(
				HttpStatus.UNAUTHORIZED,
				'Authentication Error',
				'Invalid token',
			);
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
