import {
  AbilityBuilder,
  AbilityClass,
  ConditionsMatcher,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { Post } from '../post/entities/post.entity';
import { User } from '../user/entities/user.entity';
import { Action } from './enum/action.enum';
import { Role } from 'src/types/enum/role.enum';

type Subjects = InferSubjects<typeof Post | typeof User> | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Action, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    can(Action.Read, 'all');

    if (user.role === Role.Author) {
      can(Action.Create, Post);
    }

    if (user.role === Role.Admin) {
      can(Action.Manage, 'all');
    }

    // can(Action.Update, Post, { author: { id: user.id } });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
