import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { BasketDto, DiscountBasketDto } from './dto/basket.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserBasketEntity } from './entities/basket.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodService } from '../menu/services/food.service';
import {
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enums/messages.enum';
import { DiscountService } from '../discount/discount.service';
import { DiscountEntity } from '../discount/entities/discount.entity';

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(UserBasketEntity)
    private basketRepository: Repository<UserBasketEntity>,
    @InjectRepository(DiscountEntity)
    private discountRepository: Repository<DiscountEntity>,
    private foodService: FoodService,
    private discountService: DiscountService,
  ) {}
  async addToBasket(basketDto: BasketDto) {
    const { id: userId } = this.request.user;
    const { foodId } = basketDto;
    const food = await this.foodService.getOne(foodId);
    let basketItem = await this.basketRepository.findOne({
      where: {
        ordered: false,
        userId,
        foodId,
      },
    });
    if (basketItem) {
      basketItem.count += 1;
    } else {
      basketItem = this.basketRepository.create({ foodId, userId, count: 1 });
    }
    await this.basketRepository.save(basketItem);
    return {
      message: PublicMessage.AddToBasket,
    };
  }

  async removeFromBasket(basketDto: BasketDto) {
    const { id: userId } = this.request.user;
    const { foodId } = basketDto;
    const food = await this.foodService.getOne(foodId);
    let basketItem = await this.basketRepository.findOne({
      where: {
        ordered: false,
        userId,
        foodId,
      },
    });
    if (basketItem) {
      if (basketItem.count <= 1) {
        await this.basketRepository.delete({ id: basketItem.id });
      } else {
        basketItem.count -= 1;
        await this.basketRepository.save(basketItem);
      }
      return {
        message: PublicMessage.RemoveFromBasket,
      };
    }
    throw new NotFoundException(NotFoundMessage.foodInBasket);
  }

  async addDiscount(discountDto: DiscountBasketDto) {
    const { id: userId } = this.request.user;
    const { code } = discountDto;
    const discount = await this.discountService.findOneByCode(code);
    if (!discount.active) {
      throw new BadRequestException('کد تخفیف غیرفعال است');
    }
    if (discount.limit && discount.limit <= discount.usage) {
      throw new BadRequestException('کد تخفیف تمام شده است');
    }
    if (
      discount.expires_in &&
      discount.expires_in?.getTime() <= new Date().getTime()
    ) {
      throw new BadRequestException('کد تخفیف منقضی شده است');
    }
    //// ?
    const userBasketDiscount = await this.basketRepository.findOneBy({
      ordered: false,
      discountId: discount.id,
      userId,
    });
    if (userBasketDiscount) {
      throw new BadRequestException('قبلا از تخفیف استفاده کرده اید');
    }
    if (discount.supplierId) {
      //* To avoid using multiple discount codes from the same supplier
      const discountOfSupplier = await this.basketRepository.findOne({
        relations: {
          discount: true,
        },
        where: {
          ordered: false,
          userId,
          discount: {
            supplierId: discount.supplierId,
          },
        },
      });
      if (discountOfSupplier) {
        throw new BadRequestException(BadRequestMessage.SeveralDiscount);
      }
      //*To see if the food in the basket is for the supplier or not
      const userBasket = await this.basketRepository.findOne({
        relations: {
          food: true,
        },
        where: {
          userId,
          ordered: false,
          food: {
            supplierId: discount.supplierId,
          },
        },
      });
      if (!userBasket) {
        throw new BadRequestException(BadRequestMessage.BasketDiscount);
      }
    } else if (!discount.supplierId) {
      const generalDiscount = await this.basketRepository.findOne({
        relations: {
          discount: true,
        },
        where: {
          userId,
          ordered: false,
          discount: {
            supplierId: IsNull(),
            id: Not(IsNull()),
          },
        },
      });
      //* To use the discount code only once in the basket
      if (generalDiscount) {
        throw new BadRequestException('قبلا از تخفیف استفاده کرده اید');
      }
    }
    await this.basketRepository.insert({ discountId: discount.id, userId });
    return {
      message: 'کدتخفیف با موفقیت اضافه شد',
    };
  }

  async removeDiscount(discountDto: DiscountBasketDto) {
    const { id: userId } = this.request.user;
    const { code } = discountDto;
    const discount = await this.discountService.findOneByCode(code);
    const basketDiscount = await this.basketRepository.findOne({
      where: {
        ordered: false,
        userId,
        discountId: discount.id,
      },
    });
    if (!basketDiscount)
      throw new BadRequestException('کد تخفیف در سبد خرید پیدا نشد');
    await this.basketRepository.delete({
      discountId: discount.id,
      userId,
      ordered: false,
    });
    return {
      message: PublicMessage.Deleted,
    };
  }
  async getBasket() {
    const { id: userId } = this.request.user;
    const basketItem = await this.basketRepository.find({
      relations: {
        discount: true,
        food: {
          supplier: true,
        },
      },
      where: {
        userId,
        ordered: false,
      },
    });
    const foods = basketItem.filter((item) => item.foodId);
    if (foods.length <= 0) {
      throw new BadRequestException(BadRequestMessage.BasketEmpty);
    }
    const supplierDiscount = basketItem.filter(
      (item) => item.discount?.supplierId,
    );
    const generalDiscount = basketItem.find(
      (item) => item.discount?.id && !item.discount.supplierId,
    );
    let total_amount = 0,
      payment_amount = 0,
      total_discount_amount = 0,
      foodList = [];
    for (const item of foods) {
      let discount_amount = 0;
      let discountCode: string = null;
      const { food, count } = item;
      const supplierId = food.supplierId;
      let foodPrice = food.price * count;
      //* To see if the food itself is discounted
      if (food.is_active_discount && food.discount > 0) {
        discount_amount += foodPrice * (food.discount / 100);
        foodPrice = foodPrice - foodPrice * (food.discount / 100);
      }
      //*To apply supplier discounts
      const discountItem = supplierDiscount.find(
        ({ discount }) => discount.supplierId === supplierId,
      );
      if (discountItem) {
        const {
          discount: { active, amount, percent, limit, usage, code },
        } = discountItem;
        if (active) {
          if (!limit || (limit && limit > usage)) {
            discountCode = code;
            if (percent && percent > 0) {
              discount_amount = foodPrice * (percent / 100);
              foodPrice -= foodPrice * (percent / 100);
            } else if (amount && amount > 0) {
              discount_amount += amount;
              foodPrice = amount > foodPrice ? 0 : foodPrice - amount;
            }
          }
        }
      }
      total_amount += food.price * count;
      payment_amount += foodPrice;
      total_discount_amount = discount_amount;
      foodList.push({
        name: food.name,
        foodId: food.id,
        description: food.description,
        count,
        image: food.image,
        price: +food.price,
        total_amount: food.price * count,
        discount_amount,
        payment_amount: food.price * count - discount_amount,
        discountCode,
        supplierId,
        supplierName: food.supplier.store_name,
        //TODO add supplier image
      });
    }
    let generalDiscountDetail = {};
    if (generalDiscount?.discount.active) {
      const {
        discount: { limit, code, usage, percent, amount },
      } = generalDiscount;
      if (limit && limit > usage) {
        let discount_amount = 0;
        if (percent && percent > 0) {
          discount_amount = payment_amount * (percent / 100);
        } else if (amount && amount > 0) {
          discount_amount = amount;
        }
        payment_amount =
          discount_amount > payment_amount
            ? 0
            : payment_amount - discount_amount;
        total_discount_amount += discount_amount;
        generalDiscountDetail = {
          code,
          percent,
          amount,
          discount_amount,
        };
      }
    }
    return {
      total_amount,
      total_discount_amount,
      payment_amount,
      foodList,
      generalDiscountDetail,
    };
  }
  async basketOrdered() {
    const { id: userId } = this.request.user;
    await this.basketRepository.update({ userId }, { ordered: true });
  }
}
