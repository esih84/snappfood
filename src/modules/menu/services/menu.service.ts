import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from '../entities/menu.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { NotFoundMessage, PublicMessage } from 'src/common/enums/messages.enum';
import { CreateMenuDto } from '../dto/menu.dto';

@Injectable({ scope: Scope.REQUEST })
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}
  async create(menuDto: CreateMenuDto) {
    const { id } = this.request.supplier;
    const menu = this.menuRepository.create({
      title: menuDto.title,
      supplierId: id,
    });
    await this.menuRepository.save(menu);
    return {
      message: PublicMessage.Created,
    };
  }
  async update(id: number, menuDto: CreateMenuDto) {
    const menu = await this.findOneById(id);
    const { title } = menuDto;
    if (title) menu.title = title;
    await this.menuRepository.save(menu);
    return {
      message: PublicMessage.Updated,
    };
  }
  async findAll() {
    const { id: supplierId } = this.request.supplier;
    return await this.menuRepository.findAndCount({
      where: { supplierId },
      order: { id: 'DESC' },
    });
  }
  async findOneById(id: number) {
    const { id: supplierId } = this.request.supplier;

    const menu = await this.menuRepository.findOneBy({
      id,
      supplierId,
    });
    if (!menu) throw new NotFoundException(NotFoundMessage.menu);
    return menu;
  }
  async remove(id: number) {
    const menu = await this.findOneById(id);

    await this.menuRepository.delete({ id });
    return {
      message: PublicMessage.Deleted,
    };
  }
}
