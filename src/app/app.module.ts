import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/modules/category/category.module';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SupplierModule } from 'src/modules/supplier/supplier.module';
import { MenuModule } from 'src/modules/menu/menu.module';
import { DiscountModule } from 'src/modules/discount/discount.module';
import { BasketModule } from 'src/modules/basket/basket.module';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { OrderModule } from 'src/modules/order/order.module';
import { HttpApiModule } from 'src/modules/http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), '.env'),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig()),
    CategoryModule,
    UserModule,
    AuthModule,
    SupplierModule,
    MenuModule,
    DiscountModule,
    BasketModule,
    PaymentModule,
    OrderModule,
    HttpApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
