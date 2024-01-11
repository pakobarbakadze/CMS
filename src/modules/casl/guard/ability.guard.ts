import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_ABILITY, RequiredRule } from '../decorator/abilities.decorator';
import { CaslAbilityFactory } from '../casl-ability.factory';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const rule: RequiredRule = this.reflector.get<RequiredRule>(
      CHECK_ABILITY,
      context.getHandler(),
    );

    if (!rule) return true;

    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    return ability.can(rule.action, rule.subject);
  }
}
