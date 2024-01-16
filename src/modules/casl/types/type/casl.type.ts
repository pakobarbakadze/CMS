import { InferSubjects, MongoAbility } from '@casl/ability';
import { Post } from 'src/modules/post/entities/post.entity';
import { Actions } from '../enum/action.enum';

export type Subjects = InferSubjects<typeof Post> | 'all';
export type AppAbility = MongoAbility<[Actions, Subjects]>;
