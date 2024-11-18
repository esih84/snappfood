import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { OrderEntity } from './entities/order.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketType } from '../basket/basket.type';
import { UserAddressEntity } from '../user/entities/address.entity';
import {
  BadRequestMessage,
  NotFoundMessage,
} from 'src/common/enums/messages.enum';
import { OrderItemStatus, OrderStatus } from './enums/status.enum';
import { OrderItemEntity } from './entities/order-items.entity';
import { PaymentDto } from '../payment/dto/payment.dto';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserAddressEntity)
    private userAddressRepository: Repository<UserAddressEntity>,
    private dataSource: DataSource,
  ) {}
  async create(basket: BasketType, paymentDto: PaymentDto) {
    const { addressId, description = undefined } = paymentDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { id: userId } = this.request.user;
      const address = await this.userAddressRepository.findOneBy({
        id: addressId,
        userId,
      });
      if (!address) throw new NotFoundException(NotFoundMessage.Address);
      const { foodList, payment_amount, total_amount, total_discount_amount } =
        basket;
      let order = queryRunner.manager.create(OrderEntity, {
        addressId,
        userId,
        total_amount,
        description,
        discount_amount: total_discount_amount,
        payment_amount,
        status: OrderStatus.Pending,
      });
      order = await queryRunner.manager.save(OrderEntity, order);
      let orderItems: DeepPartial<OrderItemEntity>[] = [];
      for (const item of foodList) {
        orderItems.push({
          count: item.count,
          foodId: item.foodId,
          orderId: order.id,
          status: OrderItemStatus.Pending,
          supplierId: item.supplierId,
        });
      }
      if (orderItems.length > 0) {
        await queryRunner.manager.insert(OrderItemEntity, orderItems);
      } else {
        throw new BadRequestException(BadRequestMessage.OrderFoodList);
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }
  async findOne(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException(NotFoundMessage.Order);
    return order;
  }
  async save(order: OrderEntity) {
    return await this.orderRepository.save(order);
  }
  async perviousUserOrders() {
    const { id: userId } = this.request.user;
    const orders = await this.orderRepository.find({
      where: { userId },
      relations: {
        address: true,
        items: {
          supplier: true,
          food: true,
        },
      },
      select: {
        id: true,

        items: {
          id: true,
          supplier: {
            id: true,
            store_name: true,
          },
          food: {
            name: true,
          },

          count: true,
        },
        address: {
          title: true,
        },
        created_at: true,
      },
    });
    return orders;
  }
}
