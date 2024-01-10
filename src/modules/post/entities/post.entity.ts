import { Entity, Column, ManyToOne } from 'typeorm';
import Model from 'src/entities/model.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity('posts')
export class Post extends Model {
  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}
