import { Global, Module } from '@nestjs/common';
import { HealthCheckerController } from './health-checker.controller';

@Global()
@Module({
	imports: [],
	controllers: [HealthCheckerController],
	providers: [],
})
export class HealthCheckerModule {}
