import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { UserAuth } from 'src/common/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/previous-user-orders')
  @UserAuth()
  perviousUserOrders() {
    return this.orderService.perviousUserOrders();
  }
}
