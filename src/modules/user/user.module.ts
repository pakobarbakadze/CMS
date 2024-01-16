import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserPasswordService } from './user-password.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserPasswordService],
  exports: [UserService],
})
export class UserModule {}
