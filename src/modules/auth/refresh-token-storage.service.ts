import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import InsertRefreshTokenDto from './dto/insert-refresh-token.dto';

@Injectable()
export class RefreshTokenStorage {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async insert(insertRefreshTokenDto: InsertRefreshTokenDto): Promise<void> {
    const { userId, deviceId, token } = insertRefreshTokenDto;
    const refreshToken = new RefreshToken();
    refreshToken.userId = userId;
    refreshToken.deviceId = deviceId;
    refreshToken.refreshToken = token;

    await this.refreshTokenRepository.save(refreshToken);
  }

  async validate(userId: string, deviceId: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { userId, deviceId },
    });
    if (!refreshToken) {
      throw new Error('Invalidated Refresh Token');
    }
    return true;
  }

  async invalidate(userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ userId });
  }
}
