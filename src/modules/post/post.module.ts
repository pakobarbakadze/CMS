import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from '../casl/casl.module';
import { Post } from './entities/post.entity';
import { PostsController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [forwardRef(() => CaslModule), TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostService, PostRepository],
  exports: [PostService],
})
export class PostModule {}
