import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  public create(company: Partial<Post>): Post {
    return this.postRepository.create(company);
  }

  public save(company: Post): Promise<Post> {
    return this.postRepository.save(company);
  }

  public findOne(conditions: FindOneOptions<Post>): Promise<Post> {
    return this.postRepository.findOne(conditions);
  }

  public find(conditions?: FindManyOptions<Post>): Promise<Post[]> {
    return this.postRepository.find(conditions);
  }

  public delete(id: string): Promise<DeleteResult> {
    return this.postRepository.delete(id);
  }
}
