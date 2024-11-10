import { EntityNames } from 'src/common/enums/entity-name.enum';
import { SupplierEntity } from 'src/modules/supplier/entities/supplier.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FoodEntity } from './food.entity';

@Entity(EntityNames.Menu)
export class MenuEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column()
  title: string;
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.menuTypes, {
    onDelete: 'CASCADE',
  })
  supplier: SupplierEntity;
  @Column()
  supplierId: number;
  @OneToMany(() => FoodEntity, (food) => food.menu)
  items: MenuEntity[];
}
