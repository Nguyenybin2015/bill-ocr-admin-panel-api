import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mediafile, User, UserLog } from '../../database/entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [TypeOrmModule.forFeature([Mediafile, UserLog, User])],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
