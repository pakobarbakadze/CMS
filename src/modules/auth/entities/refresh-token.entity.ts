import Model from 'src/entities/model.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('refresh-tokens')
export class RefreshToken extends Model {
  @OneToMany(() => User, (user) => user.id)
  userId: string;

  @Column({ unique: true })
  deviceId: string;

  @Column({ unique: true })
  refreshToken: string;
}
