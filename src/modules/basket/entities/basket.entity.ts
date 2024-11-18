import { EntityNames } from 'src/common/enums/entity-name.enum';
import { DiscountEntity } from 'src/modules/discount/entities/discount.entity';
import { FoodEntity } from 'src/modules/menu/entities/food.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity(EntityNames.UserBasket)
export class UserBasketEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ nullable: true })
  foodId: number;
  @Column()
  userId: number;
  @Column({ nullable: true })
  count: number;
  @Column({ nullable: true })
  discountId: number;
  @Column({ default: false })
  ordered: boolean;
  @ManyToOne(() => FoodEntity, (food) => food.baskets, { onDelete: 'CASCADE' })
  food: FoodEntity;
  @ManyToOne(() => UserEntity, (user) => user.basket, { onDelete: 'CASCADE' })
  user: UserEntity;
  @ManyToOne(() => DiscountEntity, (discount) => discount.baskets, {
    onDelete: 'CASCADE',
  })
  discount: DiscountEntity;
}
