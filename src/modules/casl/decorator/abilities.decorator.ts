import { SetMetadata } from '@nestjs/common';
import { Actions } from '../types/enum/action.enum';
import { Subjects } from '../types/type/casl.type';

export const CHECK_ABILITY = 'check_ability';

export interface RequiredRule {
  action: Actions;
  subject: Subjects;
  fetch?: boolean;
}

export const checkAbilites = (requirements: RequiredRule) =>
  SetMetadata(CHECK_ABILITY, requirements);
