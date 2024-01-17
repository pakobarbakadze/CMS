import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthorizedRequest } from 'src/types/interface/request.interface';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { VerifyTwoFactorAuthDto } from './dto/verify-2fa.dto';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Controller('2fa')
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @Post('/enable-2fa')
  @UseGuards(JwtAuthGuard)
  enableTwoFactorAuth(@Req() req: AuthorizedRequest) {
    return this.twoFactorAuthService.enableTwoFactorAuth(req.user);
  }

  @Post('/disable-2fa')
  @UseGuards(JwtAuthGuard)
  disableTwoFactorAuth(@Req() req: AuthorizedRequest) {
    return this.twoFactorAuthService.disableTwoFactorAuth(req.user);
  }

  @Post('/verify-2fa')
  @UseGuards(JwtAuthGuard)
  verifyTwoFactorAuth(
    @Req() req: AuthorizedRequest,
    @Body() verifyTwoFactorAuthDto: VerifyTwoFactorAuthDto,
  ) {
    return this.twoFactorAuthService.verifyTwoFactorAuth(
      req.user,
      verifyTwoFactorAuthDto,
    );
  }
}
