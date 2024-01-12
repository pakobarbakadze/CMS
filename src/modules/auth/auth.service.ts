import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import SignInDto from './dto/sign-in.dto';
import SignUpDto from './dto/sign-up.dto';
import { RefreshTokenStorage } from './refresh-token-storage.service';
import { Payload } from './type/payload.type';
import { CompanyService } from '../company/company.service';

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
  public async signIn(signInDto: SignInDto) {
    const { id, username } = signInDto;

    const user = await this.userService.findById(id);

    const payload: Payload = { sub: id, username: username };

    const [accessToken, refreshToken] = await this.signTokens(payload);

    await this.refreshTokenStorage.insert({ user, token: refreshToken });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  public async signUp(signUpDto: SignUpDto) {
    const { username, password, companyName } = signUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const company = await this.companyService.findByName(companyName);

    const createdUser = await this.userService.create({
      username,
      hashedPassword,
      company,
    });
    delete createdUser.password;

    return createdUser;
  }

  public async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) throw new UnauthorizedException('Invalid username or password');

    if (await user.validatePassword(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  public async refreshAccessToken(
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

  // TODO: It should invalidate tokens which have same deviceId as user is sending request from
  public async invalidateToken(authorization: string) {
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
