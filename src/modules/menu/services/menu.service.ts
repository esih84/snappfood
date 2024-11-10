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

@Injectable({ scope: Scope.REQUEST })
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}
  async create(createDto: { title: string }) {
    const { id } = this.request.supplier;
    const menu = this.menuRepository.create({
      title: createDto.title,
      supplierId: id,
    });
    await this.menuRepository.save(menu);
    return {
      message: PublicMessage.Created,
    };
  }
  async findAll() {
    return await this.menuRepository.findAndCount({
      where: {},
      order: { id: 'DESC' },
    });
  }
  async findOneById(id: number) {
    const menu = await this.menuRepository.findOneBy({
      id,
    });
    if (!menu) throw new NotFoundException(NotFoundMessage.menu);
    return menu;
  }
  async remove(id: number) {
    const { id: supplierId } = this.request.supplier;
    const menu = await this.findOneById(id);
    if (menu.supplierId !== supplierId) {
      throw new ForbiddenException();
    }
    await this.menuRepository.delete({ id });
    return {
      message: PublicMessage.Deleted,
    };
  }
}
