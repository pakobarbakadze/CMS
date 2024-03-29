import { Test, TestingModule } from '@nestjs/testing';
import { Role } from 'src/common/types/enum/role.enum';
import { AuthorizedRequest } from 'src/common/types/interface/request.interface';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PostAbilityGuard } from '../casl/guard/post-ability.guard';
import { User } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { PostsRepository } from './post.repository';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PostAbilityGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'test',
        content: 'test',
      };

      const request: AuthorizedRequest = {
        user: { id: '0' } as User,
      } as AuthorizedRequest;

      const post: Post = { id: '0', ...createPostDto } as Post;

      jest.spyOn(service, 'create').mockResolvedValue(post);

      const result = await controller.create(request, createPostDto);

      expect(result).toBeDefined();
      expect(service.create).toHaveBeenCalledWith(createPostDto, request.user);
    });
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      const user: User = {
        id: '1',
        username: 'testuser',
        password: 'password',
        role: Role.User,
      } as User;
      const request: AuthorizedRequest = { user } as AuthorizedRequest;

      const mockPosts: Post[] = [
        { id: '1', title: 'Post 1', content: 'Content 1' } as Post,
        { id: '2', title: 'Post 2', content: 'Content 2' } as Post,
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockPosts);

      const result = await controller.findAll(request);

      expect(result).toEqual(mockPosts);
      expect(service.findAll).toHaveBeenCalledWith(request.user);
    });
  });

  describe('findOne', () => {
    it('should return a specific post', async () => {
      const postId = '1';

      const mockPost: Post = {
        id: '0',
        title: 'Post',
        content: 'Content',
      } as Post;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPost);

      const result = await controller.findOne(postId);

      expect(result).toEqual(mockPost);
      expect(service.findOne).toHaveBeenCalledWith({ where: { id: postId } });
    });
  });
});
