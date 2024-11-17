import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MenuService } from './services/menu.service';
import { FeedbackService } from './services/feedback.service';
import { MenuController } from './controllers/menu.controller';
import { FoodService } from './services/food.service';
import { FeedbackController } from './controllers/feedback.controller';
import { FoodController } from './controllers/food.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuEntity } from './entities/menu.entity';
import { FoodEntity } from './entities/food.entity';
import { FeedbackEntity } from './entities/feedback.entity';
import { SupplierModule } from '../supplier/supplier.module';
import { SupplierStatusMiddleware } from '../supplier/middlewares/supplier-status.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuEntity, FoodEntity, FeedbackEntity]),
    SupplierModule,
  ],
  exports: [TypeOrmModule, FoodService],
  controllers: [MenuController, FeedbackController, FoodController],
  providers: [MenuService, FeedbackService, FoodService],
})
export class MenuModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SupplierStatusMiddleware).forRoutes(MenuController);
    consumer.apply(SupplierStatusMiddleware).forRoutes(
      {
        path: '/food',
        method: RequestMethod.PUT,
      },
      {
        path: '/food',
        method: RequestMethod.POST,
      },
      {
        path: '/food',
        method: RequestMethod.DELETE,
      },
      {
        path: '/food/:id',
        method: RequestMethod.GET,
      },
    );
  }
}
