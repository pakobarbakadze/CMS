import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, hashedPassword, company } = createUserDto;
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      company,
    });
    return await this.userRepository.save(user);
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
}
