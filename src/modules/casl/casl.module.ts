import { Module, forwardRef } from '@nestjs/common';
import { PostsModule } from '../post/posts.module';
import { CaslAbilityFactory } from './casl-ability.factory';

@Module({
  imports: [forwardRef(() => PostsModule)],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
