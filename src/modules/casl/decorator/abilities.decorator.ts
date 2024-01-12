import { SetMetadata } from '@nestjs/common';
import { Action } from '../enum/action.enum';

export const CHECK_ABILITY = 'check_ability';

export interface RequiredRule {
  action: Action;
  subject: any;
  fetch?: boolean;
}

export const checkAbilites = (requirements: RequiredRule) =>
  SetMetadata(CHECK_ABILITY, requirements);
