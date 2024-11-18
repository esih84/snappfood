import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBasketEntity } from './entities/basket.entity';
import { DiscountEntity } from '../discount/entities/discount.entity';
import { AuthModule } from '../auth/auth.module';
import { DiscountService } from '../discount/discount.service';
import { MenuModule } from '../menu/menu.module';

@Module({
  imports: [
    AuthModule,
    MenuModule,
    TypeOrmModule.forFeature([UserBasketEntity, DiscountEntity]),
  ],
  controllers: [BasketController],
  providers: [BasketService, DiscountService],
  exports: [TypeOrmModule, BasketService, DiscountService],
})
export class BasketModule {}
