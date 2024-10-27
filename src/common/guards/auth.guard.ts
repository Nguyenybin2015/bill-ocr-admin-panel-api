import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { cfg } from '../../config/env.config';
import { User } from '../../database/entities';
import { Logger } from '../../logger/logger.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ErrorException } from '../exceptions/error.exception';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private reflector: Reflector,
		private readonly logger: Logger,

		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			// 💡 See this condition
			return true;
		}

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
			const pubCert = fs.readFileSync(cfg('JWT_PUBLIC_KEY'));

			const payload = await this.jwtService.verifyAsync(token, {
				publicKey: pubCert,
			});

			const user = await this.userRepository
				.createQueryBuilder('user')
				.addSelect(['user.password', 'user.tokenInfo'])
				.where('user.id = :id', { id: payload.id })
				.getOne();

			if (!user) {
				throw new ErrorException(
					HttpStatus.UNAUTHORIZED,
					'Authentication Error',
					'payload ',
				);
			}
			if (user.tokenInfo?.crm !== token) {
				throw new ErrorException(
					HttpStatus.UNAUTHORIZED,
					'Authentication Error',
					'token',
				);
			}
			delete user.tokenInfo;
			delete user.images;
			delete user.creatorInfo;
			delete user.loginInfo;
			delete user.password;

			request['state'] = { user: user };
		} catch (error) {
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
