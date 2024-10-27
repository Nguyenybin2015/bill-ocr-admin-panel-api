import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import Enum from '../../common/constants';
import { Public } from '../../common/decorators/public.decorator';
import { ErrorException } from '../../common/exceptions/error.exception';
import { cfg } from '../../config/env.config';

@ApiTags('HealthChecker')
@Controller('')
export class HealthCheckerController {
	@Public()
	@Get('v1/enums')
	async enum() {
		if (cfg('NODE_ENV') === 'production') {
			throw new ErrorException(
				403,
				'Forbidden',
				'Access to this endpoint is disabled in production',
			);
		}
		return Enum;
	}
	@Public()
	@Get('v1/health-checker')
	async check() {
		return process.env.npm_package_version;
	}

	@Public()
	@Get('')
	async data() {
		return process.env.npm_package_version;
	}
}
