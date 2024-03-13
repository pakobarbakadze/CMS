import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PostsService } from 'src/modules/post/posts.service';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { CHECK_ABILITY, RequiredRule } from '../decorator/abilities.decorator';

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
