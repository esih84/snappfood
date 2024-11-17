import { EntityNames } from 'src/common/enums/entity-name.enum';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity(EntityNames.Payment)
export class PaymentEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  userId: number;
  @Column()
  orderId: number;
  @Column()
  amount: number;
  @Column()
  invoice_number: number;
  @ManyToOne(() => OrderEntity, (order) => order.payments, {
    onDelete: 'CASCADE',
  })
  order: OrderEntity;
  @ManyToOne(() => UserEntity, (user) => user.payments, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  @CreateDateColumn()
  create_at: Date;
}
