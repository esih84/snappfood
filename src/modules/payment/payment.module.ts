import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { AuthModule } from '../auth/auth.module';
import { BasketModule } from '../basket/basket.module';
import { OrderService } from '../order/order.service';
import { UserAddressEntity } from '../user/entities/address.entity';
import { OrderEntity } from '../order/entities/order.entity';

@Module({
  imports: [
    AuthModule,
    BasketModule,
    TypeOrmModule.forFeature([PaymentEntity, UserAddressEntity, OrderEntity]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, OrderService],
})
export class PaymentModule {}
