import { Module, forwardRef } from '@nestjs/common';
import { PostModule } from '../post/post.module';
import { CaslAbilityFactory } from './casl-ability.factory';

@Module({
  imports: [forwardRef(() => PostModule)],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
