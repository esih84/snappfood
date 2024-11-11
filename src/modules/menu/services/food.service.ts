import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { NotFoundMessage, PublicMessage } from 'src/common/enums/messages.enum';
import { FoodEntity } from '../entities/food.entity';
import { CreateFoodDto, UpdateFoodDto } from '../dto/food.dto';
import { MenuService } from './menu.service';
import { S3Service } from 'src/modules/s3/st.service';
import { MenuEntity } from '../entities/menu.entity';

@Injectable({ scope: Scope.REQUEST })
export class FoodService {
  constructor(
    @InjectRepository(FoodEntity)
    private foodRepository: Repository<FoodEntity>,
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
    @Inject(REQUEST) private request: Request,
    private menuService: MenuService,
    private s3Service: S3Service,
  ) {}
  async create(foodDto: CreateFoodDto, image: Express.Multer.File) {
    const { id: supplierId } = this.request.supplier;
    const { name, description, discount, price, menuId } = foodDto;
    const menu = await this.menuService.findOneById(menuId);
    const { Location, Key } = await this.s3Service.uploadFile(
      image,
      'menu-item',
    );
    const food = this.foodRepository.create({
      name,
      description,
      discount,
      price,
      supplierId,
      image: Location,
      image_key: Key,
      menuId: menu.id,
      score: 0,
    });
    await this.foodRepository.save(food);
    return {
      message: PublicMessage.Created,
    };
  }
  async update(id: number, foodDto: UpdateFoodDto, image: Express.Multer.File) {
    const { name, description, discount, price, menuId } = foodDto;
    const food = await this.CheckExist(id);
    const updateObject: DeepPartial<FoodEntity> = {};
    if (menuId) {
      await this.menuService.findOneById(menuId);
      updateObject['menuId'] = menuId;
    }
    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        'menu-item',
      );
      if (Location) {
        updateObject['image'] = Location;
        updateObject['image_key'] = Key;
        await this.s3Service.deleteFile(food.image_key);
      }
    }
    if (name) updateObject['name'] = name;
    if (description) updateObject['description'] = description;
    if (discount && discount >= 0) updateObject['discount'] = discount;
    if (price && price > 0) updateObject['price'] = price;
    await this.foodRepository.update({ id }, updateObject);
    return {
      message: PublicMessage.Updated,
    };
  }
  async findAll(supplierId: number) {
    return await this.menuRepository.find({
      where: { supplierId },
      relations: {
        items: true,
      },
    });
  }
  async CheckExist(id: number) {
    const { id: supplierId } = this.request.supplier;

    const food = await this.foodRepository.findOneBy({
      id,
      supplierId,
    });
    if (!food) throw new NotFoundException(NotFoundMessage.food);
    return food;
  }
  async findOne(id: number) {
    const { id: supplierId } = this.request.supplier;

    const food = await this.foodRepository.findOne({
      where: { id, supplierId },
      relations: {
        feedbacks: {
          user: true,
        },
      },
      select: {
        menu: {
          title: true,
        },
        feedbacks: {
          comment: true,
          create_at: true,
          user: {
            first_name: true,
            last_name: true,
          },
          score: true,
        },
      },
    });
    if (!food) throw new NotFoundException(NotFoundMessage.food);
    return food;
  }

  async remove(id: number) {
    const menu = await this.findOne(id);

    await this.foodRepository.delete({ id });
    return {
      message: PublicMessage.Deleted,
    };
  }
}
