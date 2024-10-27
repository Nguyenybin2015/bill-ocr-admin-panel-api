import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { ReqUser } from '../../common/decorators/user.decorator';
import { AuthTokenGuard } from '../../common/guards/authToken.guard';
import { responseSSOMicrosoft } from '../../common/types/type';
import { User } from '../../database/entities';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('')
	@Public()
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	async check(@Req() req: Request) {
		const userSSO = req['user'] as responseSSOMicrosoft;

		return await this.authService.signInMs(userSSO);
	}

	@Public()
	@Post('sign-in')
	async signIn(@Body() signInDto: SignInDto) {
		const result = await this.authService.signIn(signInDto);
		return result;
	}
	@ApiBearerAuth()
	@Post('logout')
	async logout(@ReqUser() user: User) {
		await this.authService.deleteToken(user);
		return {
			success: true,
			msg: 'Logged out successfully',
		};
	}

	// @Post('sign-up')
	// @Public()
	// async signUp(@Body() signUpDto: SignUpDto) {
	// 	const result = await this.authService.signUp(signUpDto);
	// 	return result;
	// }

	// @Public()
	// @Post("check-otp")
	// async checkOTP(@Body() checkOTPDto: CheckOTPDto) {
	//   const { email, otp } = checkOTPDto;
	//   const checkedOTP = this.authService.verifyOTP(email, otp);
	//   return checkedOTP;
	// }
}
