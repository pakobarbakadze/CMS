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
    const secret = this.generateSecret();

    await this.userRepository.update(
      { id: user.id },
      { twoFactorSecret: secret },
    );

    const qrCodeUrl = await this.generateQRCodeUrl(user.username, secret);

    const htmlResponse = `
      <html>
        <body>
          <p>Scan the QR code below to enable two-factor authentication:</p>
          <img src="${qrCodeUrl}" alt="QR Code">
        </body>
      </html>
    `;

    return htmlResponse;
  }

  async disableTwoFactorAuth(user: User) {
    await this.userRepository.update(
      { twoFactorSecret: null },
      { id: user.id },
    );

    return { message: 'Two-factor authentication disabled successfully' };
  }

  verifyTwoFactorAuth(
    user: User,
    verifyTwoFactorAuthDto: VerifyTwoFactorAuthDto,
  ) {
    const { token } = verifyTwoFactorAuthDto;
    const secret = user.twoFactorSecret;
    const isValid = this.verifyToken(secret, token);

    return { isValid };
  }

  private generateSecret(): string {
    return speakeasy.generateSecret({ length: 20 }).base32;
  }

  private generateQRCodeUrl(username: string, secret: string): Promise<string> {
    return qrcode.toDataURL(
      `otpauth://totp/${username}?secret=${secret}&issuer=YourApp`,
    );
  }

  private verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
    });
  }
}
