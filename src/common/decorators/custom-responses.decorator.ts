import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';

export const CustomResponses = createParamDecorator(
	(data: string, ctx: ExecutionContext) => {
		const response: Response = ctx.switchToHttp().getResponse<Response>();
		return response;
	},
);
