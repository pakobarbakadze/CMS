import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserPasswordService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configSercive: ConfigService,
  ) {}

  async changePassword(
    authorization: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    const { password } = changePasswordDto;
    const token = authorization.split(' ')[1];
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: this.configSercive.get<string>('ACCESS_JWT_SECRET'),
    });

    const user = await this.userRepository.findOne({
      where: { id: decoded.sub },
    });
    user.password = password;
    await user.hashPass();

    delete user.password;

    return this.userRepository.save(user);
  }

  async changeUserPassword(
    changeUserPasswordDto: ChangeUserPasswordDto,
  ): Promise<User> {
    const { username, password } = changeUserPasswordDto;

    const user = await this.userRepository.findOne({
      where: { username },
    });
    user.password = password;
    await user.hashPass();

    delete user.password;

    return this.userRepository.save(user);
  }
}
