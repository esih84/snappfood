import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { EntityNames } from 'src/common/enums/entity-name.enum';

@Entity(EntityNames.Otp)
export class OTPEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  code: string;
  @Column()
  expires_in: Date;
  @Column()
  userId: Number;
  @OneToOne(() => UserEntity, (user) => user.otp, { onDelete: 'CASCADE' })
  user: UserEntity;
}
