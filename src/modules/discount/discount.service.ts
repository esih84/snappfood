import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { DeepPartial, Repository } from 'typeorm';
import {
  BadRequestMessage,
  ConflictMessages,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enums/messages.enum';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity)
    private discountRepository: Repository<DiscountEntity>,
  ) {}
  async create(createDiscountDto: CreateDiscountDto) {
    const { amount, code, expires_in, limit, percent } = createDiscountDto;
    await this.checkExistCode(code);
    const discountObject: DeepPartial<DiscountEntity> = { code };
    if ((!amount && !percent) || (amount && percent)) {
      throw new BadRequestException(BadRequestMessage.discount);
    }
    if (amount && !isNaN(parseInt(amount.toString()))) {
      discountObject['amount'] = amount;
    } else if (percent && !isNaN(parseInt(percent.toString()))) {
      discountObject['percent'] = percent;
    }
    if (expires_in && !isNaN(parseInt(expires_in.toString()))) {
      const time = 1000 * 60 * 60 * 24 * expires_in;
      discountObject['expires_in'] = new Date(new Date().getTime() + time);
    }
    if (limit && !isNaN(parseInt(limit.toString()))) {
      discountObject['limit'] = limit;
    }
    const discount = this.discountRepository.create(discountObject);
    await this.discountRepository.save(discount);
    return {
      message: PublicMessage.Created,
    };
  }
  async checkExistCode(code: string) {
    const discount = await this.discountRepository.findOneBy({ code });
    if (discount) throw new ConflictException(ConflictMessages.discount);
  }
  async findOneByCode(code: string) {
    const discount = await this.discountRepository.findOneBy({ code });
    if (!discount) throw new NotFoundException(NotFoundMessage.discount);
    return discount;
  }
  async findAll() {
    return await this.discountRepository.find({});
  }

  async remove(id: number) {
    const discount = await this.discountRepository.findOneBy({ id });
    if (!discount) throw new NotFoundException(NotFoundMessage.discount);
    await this.discountRepository.delete({ id });
    return {
      message: PublicMessage.Deleted,
    };
  }
}
