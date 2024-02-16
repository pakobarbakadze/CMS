import Model from 'src/common/entities/model.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('companies')
export class Company extends Model {
  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
