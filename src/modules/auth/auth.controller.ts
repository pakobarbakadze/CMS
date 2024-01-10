import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import SignUpDto from './dto/sign-up.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtRefreshTokenGuard } from './guard/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Request() req: any) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  refreshToken(@Headers('authorization') authorization: string) {
    return this.authService.refreshAccessToken(authorization);
  }

  @UseGuards(JwtAuthGuard)
  @Post('invalidate-token')
  invalidateToken(@Headers('authorization') authorization: string) {
    return this.authService.invalidateToken(authorization);
  }
}
