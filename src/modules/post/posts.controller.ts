import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { AuthorizedRequest } from 'src/types/interface/request.interface';
import { Role } from '../../types/enum/role.enum';
import { PostAbilityGuard } from '../casl/guard/post-ability.guard';
import { checkAbilites } from '../casl/decorator/abilities.decorator';
import { Action } from '../casl/enum/action.enum';
import { Post as PostEntity } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() request: AuthorizedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(createPostDto, request.user);
  }

  @Get()
  @checkAbilites({ action: Action.Read, subject: PostEntity })
  @UseGuards(JwtAuthGuard, PostAbilityGuard)
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @checkAbilites({ action: Action.Update, subject: PostEntity, fetch: true })
  @UseGuards(JwtAuthGuard, PostAbilityGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @checkAbilites({ action: Action.Delete, subject: PostEntity })
  @UseGuards(JwtAuthGuard, PostAbilityGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
