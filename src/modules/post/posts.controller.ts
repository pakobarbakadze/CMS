import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { AuthorizedRequest } from 'src/types/interface/request.interface';
import { Role } from '../../types/enum/role.enum';
import { AbilitiesGuard } from '../casl/guard/ability.guard';
import { checkAbilites } from '../casl/decorator/abilities.decorator';
import { Action } from '../casl/enum/action.enum';

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
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @checkAbilites({ action: Action.Delete, subject: Post })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
