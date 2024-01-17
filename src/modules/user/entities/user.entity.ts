import * as bcrypt from 'bcrypt';
import Model from 'src/entities/model.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Role } from 'src/types/enum/role.enum';
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

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

  @Column({ nullable: true })
  twoFactorSecret: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @BeforeInsert()
  async hashPass() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
