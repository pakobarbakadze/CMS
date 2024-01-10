import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import SignInDto from './dto/sign-in.dto';
import SignUpDto from './dto/sign-up.dto';
import { RefreshTokenStorage } from './refresh-token-storage.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenStorage: RefreshTokenStorage,
    private readonly configSercive: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { id, username } = signInDto;

    const payload = { sub: id, username: username };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configSercive.get<string>('REFRESH_JWT_SECRET'),
      expiresIn: '1w',
    });

    await this.refreshTokenStorage.insert({ userId: id, token: refreshToken });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async signUp(signUpDto: SignUpDto) {
    const { username, password } = signUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await this.userService.create({
      username,
      hashedPassword,
    });
    delete createdUser.password;

    return createdUser;
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) throw new UnauthorizedException('Invalid username or password');

    if (await user.validatePassword(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async refreshAccessToken(
    authorization: string,
  ): Promise<{ access_token: string }> {
    const refreshToken = authorization.split(' ')[1];
    const decoded = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configSercive.get<string>('REFRESH_JWT_SECRET'),
    });
    await this.refreshTokenStorage.validate(decoded.sub, refreshToken);
    const payload = { sub: decoded.sub, username: decoded.username };
    const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: accessToken };
  }

  async invalidateToken(authorization: string) {
    const token = authorization.split(' ')[1];
    const decoded = await this.jwtService.verifyAsync(token);
    await this.refreshTokenStorage.invalidate(decoded.sub);

    return { message: 'Token invalidated successfully' };
  }
}
