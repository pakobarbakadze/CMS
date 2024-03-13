import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthorizedRequest } from 'src/common/types/interface/request.interface';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { checkAbilites } from '../casl/decorator/abilities.decorator';
import { PostAbilityGuard } from '../casl/guard/post-ability.guard';
import { Action } from '../casl/types/enum/action.enum';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { PostsService } from './posts.service';

@Controller('post')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post()
  @checkAbilites({ action: Action.Create, subject: PostEntity })
  @UseGuards(JwtAuthGuard, PostAbilityGuard)
  create(
    @Req() request: AuthorizedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(createPostDto, request.user);
  }

  @Get()
  @checkAbilites({ action: Action.Read, subject: PostEntity })
  @UseGuards(JwtAuthGuard, PostAbilityGuard)
  findAll(@Req() request: AuthorizedRequest) {
    return this.postService.findAll(request.user);
  }

  @Get(':id')
  @checkAbilites({ action: Action.Read, subject: PostEntity })
  @UseGuards(JwtAuthGuard, PostAbilityGuard)
  findOne(@Param('id') id: string) {
    return this.postService.findOne({ where: { id } });
  }

  @Patch(':id')
  @checkAbilites({ action: Action.Update, subject: PostEntity })
  @UseGuards(JwtAuthGuard, PostAbilityGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @checkAbilites({ action: Action.Delete, subject: PostEntity })
  @UseGuards(JwtAuthGuard, PostAbilityGuard)
  remove(@Param('id') id: string) {
    return this.postService.delete(id);
  }
}
