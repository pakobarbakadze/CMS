import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, company } = createUserDto;

    const user = this.userRepository.create({
      username,
      password,
      company,
    });

    const savedUser = await this.userRepository.save(user);

    return this.sanitizeUser(savedUser);
  }

  async findOne(conditions: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne(conditions);
    return this.sanitizeUser(user);
  }

  async assignRole(assignRoleDto: AssignRoleDto): Promise<User> {
    const { username, role } = assignRoleDto;

    const user = await this.userRepository.findOne({ where: { username } });

    if (!user)
      throw new NotFoundException(`User with username '${username}' not found`);

    user.role = role;

    const savedUser = await this.userRepository.save(user);

    return this.sanitizeUser(savedUser);
  }

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) throw new UnauthorizedException('Invalid username or password');

    if (await user.validatePassword(password)) {
      return this.sanitizeUser(user);
    }

    return null;
  }

  private sanitizeUser(user: User): User {
    delete user.password;
    return user;
  }
}
