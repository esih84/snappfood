import { EntityNames } from 'src/common/enums/entity-name.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SupplierEntity } from 'src/modules/supplier/entities/supplier.entity';
import { MenuEntity } from './menu.entity';
import { FeedbackEntity } from 'src/modules/menu/entities/feedback.entity';

@Entity(EntityNames.Food)
export class FoodEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  name: string;
  @Column()
  image: string;
  @Column()
  description: string;
  @Column({ type: 'numeric' })
  price: number;
  @Column({ type: 'numeric', default: 0 })
  discount: number;
  @Column({ type: 'numeric' })
  score: number;
  @Column()
  menuId: number;
  @Column()
  supplierId: number;
  @ManyToOne(() => MenuEntity, (menu) => menu.items)
  menu: MenuEntity;
  @ManyToOne(() => SupplierEntity, (type) => type.menu, { onDelete: 'CASCADE' })
  supplier: SupplierEntity;
  @OneToMany(() => FeedbackEntity, (feedback) => feedback.food)
  feedbacks: FeedbackEntity[];
}
