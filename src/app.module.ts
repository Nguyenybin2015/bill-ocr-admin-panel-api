import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './data-source.config';
import { LoggerModule } from './logger/logger.module';
import { Logger } from './logger/logger.service';
import { AuthModule } from './modules/auth/auth.module';
import { AzureAdStrategy } from './modules/auth/azure-ad.strategy';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { UserModule } from './modules/user/user.module';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'azure-ad-bearer' }),
		TypeOrmModule.forRoot({
			...dataSourceOptions,
			autoLoadEntities: true,
			logger: new Logger(),
		}),
		LoggerModule,
		AuthModule,
		UserModule,
		HealthCheckerModule,
		ScheduleModule.forRoot(),
	],
	controllers: [AppController],
	providers: [AppService, AzureAdStrategy],
})
export class AppModule {}
