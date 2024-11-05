import { EntityNames } from 'src/common/enums/entity-name.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAddressEntity } from './address.entity';
import { OTPEntity } from './otp.entity';

@Entity(EntityNames.User)
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ nullable: true })
  first_name: string;
  @Column({ nullable: true })
  last_name: string;
  @Column({ unique: true })
  mobile: string;
  @Column({ nullable: true, unique: true })
  email: string;
  @Column({ unique: true, nullable: true })
  invite_code: string;
  @Column({ default: 0 })
  score: number;
  @Column({ nullable: true })
  agentId: number;
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
  @OneToMany(() => UserAddressEntity, (address) => address.user)
  addressList: UserAddressEntity[];
  @Column({ nullable: true })
  otpId: number;
  @OneToOne(() => OTPEntity, (otp) => otp.user)
  @JoinColumn()
  otp: OTPEntity;
  @Column({ nullable: true, default: false })
  mobile_verified: boolean;
}
