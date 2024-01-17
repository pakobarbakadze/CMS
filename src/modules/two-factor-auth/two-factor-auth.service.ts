import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { VerifyTwoFactorAuthDto } from './dto/verify-2fa.dto';

export class TwoFactorAuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async enableTwoFactorAuth(user: User) {
    const secret = speakeasy.generateSecret({ length: 20 }).base32;

    await this.userRepository.update(
      { id: user.id },
      { twoFactorSecret: secret },
    );

    const qrCodeUrl = await qrcode.toDataURL(
      `otpauth://totp/${user.username}?secret=${secret}&issuer=YourApp`,
    );

    return { qrCodeUrl };
  }

  async verifyTwoFactorAuth(
    user: User,
    verifyTwoFactorAuthDto: VerifyTwoFactorAuthDto,
  ) {
    const { token } = verifyTwoFactorAuthDto;

    const { twoFactorSecret } =
      (await this.userRepository.findOne({
        where: { id: user.id },
        select: ['twoFactorSecret'],
      })) || {};

    if (!twoFactorSecret)
      throw new NotFoundException('2FA is not enabled for this user');

    const isValid = speakeasy.totp.verify({
      secret: twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!isValid)
      throw new UnauthorizedException('Invalid two-factor authentication code');

    return { isValid };
  }

  async disableTwoFactorAuth(user: User) {
    await this.userRepository.update(
      { id: user.id },
      { twoFactorSecret: null },
    );

    return { message: 'Two-factor authentication disabled successfully' };
  }
}
