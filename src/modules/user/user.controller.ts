import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { Role } from 'src/types/enum/role.enum';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { AssignRoleDto } from './dto/assign-role.dto';
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
}
