import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BasketService } from '../basket/basket.service';
import { ZarinnpalService } from '../http/zarinnpal.service';
import { OrderService } from '../order/order.service';
import { PaymentDataDto, PaymentDto } from './dto/payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import {
  BadRequestMessage,
  PublicMessage,
} from 'src/common/enums/messages.enum';
import { OrderStatus } from '../order/enums/status.enum';
@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private basketService: BasketService,
    private zarinnpalService: ZarinnpalService,
    private orderService: OrderService,
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
  ) {}
  async getGetWayUrl(paymentDto: PaymentDto) {
    const { id: userId } = this.request.user;
    const basket = await this.basketService.getBasket();
    const order = await this.orderService.create(basket, paymentDto);
    const payment = await this.create({
      amount: basket.payment_amount,
      orderId: order.id,
      userId,
      status: basket.payment_amount === 0,
      invoice_number: new Date().getTime().toString(),
    });
    if (!payment.status) {
      const { authority, code, getWayURL } =
        await this.zarinnpalService.sendRequest({
          amount: basket.payment_amount,
          description: 'PAYMENT ORDER',
          user: {
            email: 'esi@gmail.com',
            mobile: '09330581953',
          },
        });
      payment.authority = authority;
      await this.paymentRepository.save(payment);
      return {
        getWayURL,
        code,
      };
    }
    return {
      message: PublicMessage.PaymentSuccessfully,
    };
  }
  async create(paymentDto: PaymentDataDto) {
    const { amount, invoice_number, orderId, userId, status } = paymentDto;
    const payment = this.paymentRepository.create({
      amount,
      invoice_number,
      orderId,
      status,
      userId,
    });
    return await this.paymentRepository.save(payment);
  }

  async verify(authority: string, status: string) {
    const payment = await this.paymentRepository.findOneBy({ authority });
    if (!payment) throw new NotFoundException('payment already verify');
    if (payment.status) throw new ConflictException();
    if (status === 'OK') {
      const order = await this.orderService.findOne(payment.orderId);
      order.status = OrderStatus.Paid;
      await this.orderService.save(order);
      payment.status = true;
    } else {
      return 'http://frontendurl.com/payment?status=false';

      throw new BadRequestException(BadRequestMessage.PaymentFailed);
    }
    await this.paymentRepository.save(payment);
    return 'http://frontendurl.com/payment?status=true';
  }
}
