import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configSercive: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, company } = createUserDto;
    const user = this.userRepository.create({
      username,
      password,
      company,
    });
    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    delete user.password;
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    delete user.password;
    return user;
  }

  async assignRole(assignRoleDto: AssignRoleDto): Promise<User> {
    const { username, role } = assignRoleDto;

    const user = await this.findByUsername(username);

    if (!user)
      throw new NotFoundException(`User with username '${username}' not found`);

    user.role = role;

    return this.userRepository.save(user);
  }

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

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) throw new UnauthorizedException('Invalid username or password');

    if (await user.validatePassword(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
