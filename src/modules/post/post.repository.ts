import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  public create(post: Partial<Post>): Post {
    return this.postRepository.create(post);
  }

  public save(post: Post): Promise<Post> {
    return this.postRepository.save(post);
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

  public update(id: string, post: Partial<Post>): Promise<UpdateResult> {
    return this.postRepository.update(id, post);
  }
}
