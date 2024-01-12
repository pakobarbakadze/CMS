import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/db';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PostsModule } from './modules/post/posts.module';
import { CaslModule } from './modules/casl/casl.module';
import { CompanyModule } from './modules/company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        TypeOrmConfig.createTypeOrmOptions(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    PostsModule,
    CaslModule,
    CompanyModule,
  ],
})
export class AppModule {}
