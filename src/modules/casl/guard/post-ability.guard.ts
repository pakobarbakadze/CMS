import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_ABILITY, RequiredRule } from '../decorator/abilities.decorator';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { PostsService } from 'src/modules/post/posts.service';

@Injectable()
export class PostAbilityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly postsService: PostsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rule: RequiredRule = this.reflector.get<RequiredRule>(
      CHECK_ABILITY,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();

    if (!rule) return true;
    if (rule.fetch) {
      rule.subject = await this.postsService.findOne(request.params.id);
    }

    const ability = this.caslAbilityFactory.createForUser(request.user);

    return ability.can(rule.action, rule.subject);
  }
}
