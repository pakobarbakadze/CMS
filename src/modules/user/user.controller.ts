import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/types/enum/role.enum';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Patch('/role')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  assignRole(@Body() assingRoleDto: AssignRoleDto) {
    return this.userService.assignRole(assingRoleDto);
  }

  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Headers('authorization') authorization: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(authorization, changePasswordDto);
  }
}
