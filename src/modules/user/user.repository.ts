import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';

export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(user: Partial<User>): User {
    return this.userRepository.create(user);
  }

  save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  findOne(conditions: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(conditions);
  }
}
