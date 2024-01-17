import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/types/enum/role.enum';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto, author: User): Promise<Post> {
    const { title, content } = createPostDto;

    const post = this.postRepository.create({
      title,
      content,
      author,
    });

    return this.postRepository.save(post);
  }

  findAll(user: User): Promise<Post[]> {
    if (user.role === Role.User) {
      return this.postRepository.find({
        where: { created_at: MoreThanOrEqual(user.created_at) },
      });
    }

    return this.postRepository.find();
  }

  findOne(id: string): Promise<Post> {
    return this.postRepository.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: string) {
    return this.postRepository.delete(id);
  }
}
