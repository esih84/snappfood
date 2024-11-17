import { EntityNames } from 'src/common/enums/entity-name.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItemStatus } from '../enums/status.enum';
import { OrderEntity } from './order.entity';
import { FoodEntity } from 'src/modules/menu/entities/food.entity';
import { SupplierEntity } from 'src/modules/supplier/entities/supplier.entity';

@Entity(EntityNames.OrderItems)
export class OrderItemEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  foodId: number;
  @Column()
  supplierId: number;
  @Column()
  orderId: number;
  @Column()
  count: number;
  @Column({
    type: 'enum',
    enum: OrderItemStatus,
    default: OrderItemStatus.Pending,
  })
  status: string;
  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  order: OrderEntity;
  @ManyToOne(() => FoodEntity, (food) => food.orders, { onDelete: 'CASCADE' })
  food: FoodEntity;
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.orders, {
    onDelete: 'CASCADE',
  })
  supplier: SupplierEntity;
}
