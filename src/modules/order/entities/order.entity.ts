import { EntityNames } from 'src/common/enums/entity-name.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from '../enums/status.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserAddressEntity } from 'src/modules/user/entities/address.entity';
import { OrderItemEntity } from './order-items.entity';
import { PaymentEntity } from 'src/modules/payment/entities/payment.entity';

@Entity(EntityNames.Order)
export class OrderEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  userId: number;
  @Column({ nullable: true })
  addressId: number;
  @Column()
  payment_amount: number;
  @Column()
  discount_amount: number;
  @Column()
  total_amount: number;
  @Column({ nullable: true })
  description: string;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: string;
  @ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: 'CASCADE' })
  user: UserEntity;
  @ManyToOne(() => UserAddressEntity, (address) => address.orders, {
    onDelete: 'SET NULL',
  })
  address: UserAddressEntity;
  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items: OrderItemEntity[];
  //* This is because oneToMany allows you to pay part of the bill in cash, part by card, and part by payment gateway.
  @OneToMany(() => PaymentEntity, (payment) => payment.order)
  payments: PaymentEntity[];
  @CreateDateColumn()
  created_at: Date;
}
