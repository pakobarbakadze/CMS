import {
  AbilityBuilder,
  ExtractSubjectType,
  createMongoAbility,
  mongoQueryMatcher,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from 'src/types/enum/role.enum';
import { Post } from '../post/entities/post.entity';
import { User } from '../user/entities/user.entity';
import { Actions } from './types/enum/action.enum';
import { AppAbility, Subjects } from './types/type/casl.type';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    can(Actions.Read, 'all');

    if (user.role === Role.Author) {
      can(Actions.Create, Post);
    }

    if (user.role === Role.Admin) {
      can(Actions.Manage, 'all');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
      conditionsMatcher: mongoQueryMatcher,
    });
  }
}
