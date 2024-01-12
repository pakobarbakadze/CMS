import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/entities/user.entity';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { Post } from 'src/modules/post/entities/post.entity';

export class TypeOrmConfig {
  static async createTypeOrmOptions(
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: [User, Post, Company, RefreshToken],
      synchronize: true,
      autoLoadEntities: true,
    };
  }
}
