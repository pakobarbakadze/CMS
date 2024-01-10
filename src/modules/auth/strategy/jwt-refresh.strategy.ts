import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserService } from 'src/modules/user/user.service';

import { User } from 'src/modules/user/entities/user.entity';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { AuthStrategy } from '../enum/strategy.enum';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.JWT_REFRESH_TOKEN,
) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findById(payload.sub);

    if (!user) throw new UnauthorizedException();

    delete user.password;

    return user;
  }
}
