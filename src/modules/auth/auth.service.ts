import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CompanyService } from '../company/company.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import SignInDto from './dto/sign-in.dto';
import SignUpDto from './dto/sign-up.dto';
import { RefreshTokenStorage } from './refresh-token-storage.service';
import { Payload } from './types/type/payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly refreshTokenStorage: RefreshTokenStorage,
    private readonly configSercive: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // TODO: should first check if there is already refresh token saved on current device id
  // if there is then return error that user is already signed in.
  async signIn(
    signInDto: SignInDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { id, username } = signInDto;

    const user = await this.userService.findOne({ where: { id } });

    const payload: Payload = { sub: id, username: username };

    const [accessToken, refreshToken] = await this.signTokens(payload);

    await this.refreshTokenStorage.insert({ user, token: refreshToken });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { username, password, companyName } = signUpDto;

    const company = await this.companyService.findOne({
      where: { companyName },
    });

    const createdUser = await this.userService.create({
      username,
      password,
      company,
    });

    return createdUser;
  }

  async refreshAccessToken(
    authorization: string,
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string }> {
    const { deviceId } = refreshTokenDto;
    const refreshToken = authorization.split(' ')[1];
    const decoded = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configSercive.get<string>('REFRESH_JWT_SECRET'),
    });
    await this.refreshTokenStorage.validate(decoded.sub, deviceId);
    const payload = { sub: decoded.sub, username: decoded.username };
    const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: accessToken };
  }

  // TODO: It should invalidate tokens which have same deviceId as user is sending request from
  async invalidateToken(authorization: string): Promise<{ message: string }> {
    const token = authorization.split(' ')[1];
    const decoded = await this.jwtService.verifyAsync(token);
    await this.refreshTokenStorage.invalidate(decoded.sub);

    return { message: 'Token invalidated successfully' };
  }

  private signTokens(payload: Payload) {
    return Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configSercive.get<string>('REFRESH_JWT_SECRET'),
        expiresIn: '1w',
      }),
    ]);
  }
}
