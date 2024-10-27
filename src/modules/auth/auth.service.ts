import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { User } from '../../database/entities';
import { SignInDto } from './dto/auth.dto';
// import { MailerService } from '@nestjs-modules/mailer';
import Enum from '../../common/constants';
import { ErrorException } from '../../common/exceptions/error.exception';
import { responseSSOMicrosoft } from '../../common/types/type';
import { cfg } from '../../config/env.config';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,

		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async signToken(data: object) {
		const cert = fs.readFileSync(cfg('JWT_PRIVATE_KEY'));
		const token = await this.jwtService.signAsync(data, {
			algorithm: 'ES256',
			privateKey: cert,
		});
		return {
			token,
			expiresIn: '1d'
		};
	}

	hashPassword(password: string) {
		return bcrypt.hashSync(password, cfg('BCRYPT_SALT_ROUND', Number));
	}

	comparePasswords(password: string, storedPasswordHash: string) {
		return bcrypt.compareSync(password, storedPasswordHash);
	}

	async signIn({ email, password }: SignInDto) {
		const user = await this.userRepository
			.createQueryBuilder('user')
			.where('user.email = :email', { email: email })
			.addSelect('user.password')
			.getOne();

		if (!user) {
			throw new ErrorException(
				HttpStatus.NOT_FOUND,
				'signIn',
				'Email does not exist',
			);
		}

		if (user.status !== Enum.User.STATUS.ACTIVE) {
			throw new ErrorException(
				HttpStatus.FORBIDDEN,
				'signIn',
				'User already NOT_ACTIVATED or PAUSED or LOCKED',
			);
		}
		try {
			const isAuth = this.comparePasswords(password, user.password);
			if (!isAuth) {
				throw new ErrorException(
					HttpStatus.BAD_REQUEST,
					'signIn',
					'password',
					'Mật khẩu không chính xác',
				);
			}
		} catch (error) {
			throw new ErrorException(HttpStatus.BAD_REQUEST, 'signIn', error.message);
		}

		const jwt = await this.signToken({ id: user.id });
		user.tokenInfo = {
			...user.tokenInfo,
			crm: jwt.token,
		};

		await this.userRepository.save(user);

		return {
			token: jwt.token,
			expiresIn: jwt.expiresIn,
		};
	}

	async deleteToken(user: User) {
		const tokenInfo = {
			...user.tokenInfo,
			crm: '-',
		};
		try {

			await this.userRepository
				.createQueryBuilder('user')
				.update()
				.set({
					tokenInfo,
				})
				.where('id = :id', { id: user.id })
				.execute();
		} catch (error) {
			throw new ErrorException(500, 'Delete Token', error.message);
		}
		return {
			success: 'done',
		};
	}

	async signInMs(profile: responseSSOMicrosoft) {
		const user = await this.userRepository
			.createQueryBuilder('user')
			.where('user.email = :email', { email: profile.preferred_username })
			.andWhere('user.type = :type', { type: Enum.User.TYPE.MICROSOFT })
			.getOne();
		if (!user) {
			throw new ErrorException(HttpStatus.BAD_REQUEST, 'signIn', 'status');
		}
		if (user.status !== Enum.User.STATUS.ACTIVE) {
			throw new ErrorException(HttpStatus.BAD_REQUEST, 'signIn', 'status');
		}
		const jwt = await this.signToken({ id: user.id });
		user.tokenInfo = {
			...user.tokenInfo,
			crm: jwt.token,
		};

		await this.userRepository.save(user);

		return {
			token: jwt.token,
			expiresIn: jwt.expiresIn,
		};
	}
}
