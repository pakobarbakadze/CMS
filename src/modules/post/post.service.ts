import { Injectable } from '@nestjs/common';
import { Role } from 'src/common/types/enum/role.enum';
import { DeleteResult, FindOneOptions, MoreThanOrEqual } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  public create(createPostDto: CreatePostDto, author: User): Promise<Post> {
    const { title, content } = createPostDto;

    const post = this.postRepository.create({
      title,
      content,
      author,
    });

    return this.postRepository.save(post);
  }

  public findAll(user: User): Promise<Post[]> {
    if (user.role === Role.User) {
      return this.postRepository.find({
        where: { created_at: MoreThanOrEqual(user.created_at) },
      });
    }

    return this.postRepository.find();
  }

  public findOne(conditions: FindOneOptions<Post>): Promise<Post> {
    return this.postRepository.findOne(conditions);
  }

  public update(id: string, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  public delete(id: string): Promise<DeleteResult> {
    return this.postRepository.delete(id);
  }
}
