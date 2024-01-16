import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import SignUpDto from './dto/sign-up.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtRefreshTokenGuard } from './guard/jwt-refresh.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  signIn(@Request() req: any) {
    return this.authService.signIn(req.user);
  }

  @Post('sign-out')
  @UseGuards(JwtAuthGuard)
  invalidateToken(@Headers('authorization') authorization: string) {
    return this.authService.invalidateToken(authorization);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshTokenGuard)
  refreshToken(
    @Headers('authorization') authorization: string,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.refreshAccessToken(authorization, refreshTokenDto);
  }
}
