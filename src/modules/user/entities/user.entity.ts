import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
import Model from 'src/entities/model.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Role } from 'src/types/enum/role.enum';
import { Company } from 'src/modules/company/entities/company.entity';

@Entity('users')
export class User extends Model {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
