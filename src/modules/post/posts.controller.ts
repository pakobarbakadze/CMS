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
import { AuthorizedRequest } from 'src/types/interface/request.interface';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { checkAbilites } from '../casl/decorator/abilities.decorator';
import { PostAbilityGuard } from '../casl/guard/post-ability.guard';
import { Actions } from '../casl/types/enum/action.enum';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { PostsService } from './posts.service';

@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @checkAbilites({ action: Actions.Create, subject: PostEntity })
  @UseGuards(JwtAuthGuard, PostAbilityGuard)
  create(
    @Req() request: AuthorizedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(createPostDto, request.user);
  }

  @Get()
  @checkAbilites({ action: Actions.Read, subject: PostEntity })
  @UseGuards(JwtAuthGuard, PostAbilityGuard)
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @checkAbilites({ action: Actions.Update, subject: PostEntity })
  @UseGuards(JwtAuthGuard, PostAbilityGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @checkAbilites({ action: Actions.Delete, subject: PostEntity })
  @UseGuards(JwtAuthGuard, PostAbilityGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
