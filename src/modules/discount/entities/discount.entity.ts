import { EntityNames } from 'src/common/enums/entity-name.enum';
import { UserBasketEntity } from 'src/modules/basket/entities/basket.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity(EntityNames.Discount)
export class DiscountEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  code: string;
  @Column({ type: 'numeric', nullable: true })
  percent: number;
  @Column({ type: 'numeric', nullable: true })
  amount: number;
  @Column({ nullable: true })
  expires_in: Date;
  @Column({ nullable: true })
  limit: number;
  @Column({ nullable: true, default: 0 })
  usage: number;
  @Column({ nullable: true })
  supplierId: number;
  @Column({ default: true })
  active: boolean;
  @OneToMany(() => UserBasketEntity, (basket) => basket.discount)
  baskets: UserBasketEntity[];
}
