import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { AuthGuard } from './guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Logger } from '../../logger/logger.service';

@Global()
@Module({
	imports: [JwtModule, UserModule, TypeOrmModule.forFeature([User])],
	controllers: [AuthController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		AuthService,
		AuthGuard,
		Logger,
	],
	exports: [AuthGuard, AuthService],
})
export class AuthModule {}
