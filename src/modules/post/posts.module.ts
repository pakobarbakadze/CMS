import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from '../casl/casl.module';
import { Post } from './entities/post.entity';
import { PostsRepository } from './post.repository';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [forwardRef(() => CaslModule), TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsService],
})
export class PostsModule {}
