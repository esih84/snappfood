import { EntityNames } from 'src/common/enums/entity-name.enum';
import { FoodEntity } from 'src/modules/menu/entities/food.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity(EntityNames.Feedbacks)
export class FeedbackEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'numeric' })
  score: number;
  @Column()
  comment: string;
  @Column()
  userId: number;
  @ManyToOne(() => UserEntity, (user) => user.feedbacks, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  @ManyToOne(() => FoodEntity, (food) => food.feedbacks, {
    onDelete: 'CASCADE',
  })
  food: FoodEntity;
  @CreateDateColumn()
  create_at: Date;
}
