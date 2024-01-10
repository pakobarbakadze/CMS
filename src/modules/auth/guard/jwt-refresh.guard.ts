import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from '../enum/strategy.enum';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard(
  AuthStrategy.JWT_REFRESH_TOKEN,
) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
