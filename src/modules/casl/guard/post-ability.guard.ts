import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PostService } from 'src/modules/post/post.service';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { CHECK_ABILITY, RequiredRule } from '../decorator/abilities.decorator';

@Injectable()
export class PostAbilityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly postService: PostService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rule: RequiredRule = this.reflector.get<RequiredRule>(
      CHECK_ABILITY,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();

    if (!rule) return true;
    if (rule.fetch) {
      rule.subject = await this.postService.findOne(request.params.id);
    }

    const ability = this.caslAbilityFactory.createForUser(request.user);

    return ability.can(rule.action, rule.subject);
  }
}
