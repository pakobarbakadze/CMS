import { Module, forwardRef } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PostsModule } from '../post/posts.module';

@Module({
  imports: [forwardRef(() => PostsModule)],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
