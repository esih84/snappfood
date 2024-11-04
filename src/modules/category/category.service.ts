import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { DeepPartial, Repository } from 'typeorm';
import { S3Service } from '../s3/st.service';
import {
  ConflictMessages,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enums/messages.enum';
import { isBoolean, toBoolean } from 'src/common/utility/function.util';
import { EntityNames } from 'src/common/enums/entity-name.enum';
import { paginationDto } from 'src/common/dto/pagination.dto';
import {
  paginationGenerator,
  paginationResolver,
} from 'src/common/utility/pagination.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private s3Service: S3Service,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    image: Express.Multer.File,
  ) {
    const { Location, Key } = await this.s3Service.uploadFile(
      image,
      'snappfood-image',
    );
    let { slug, title, parentId, show } = createCategoryDto;
    const category = await this.findOneBySlug(slug);
    if (category) throw new ConflictException(ConflictMessages.Category);
    if (isBoolean(show)) {
      show = toBoolean(show);
    }
    let parent: CategoryEntity = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.findOneById(+parentId);
    }
    await this.categoryRepository.insert({
      title,
      slug,
      show,
      image: Location,
      imageKey: Key,
      parentId: parent?.id,
    });
    return {
      message: PublicMessage.CreatedCategory,
    };
  }

  async findAll(paginationDto: paginationDto) {
    const { page, limit, skip } = paginationResolver(
      paginationDto.page,
      paginationDto.limit,
    );
    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      relations: {
        parent: true,
      },
      select: {
        parent: {
          title: true,
        },
      },
      skip,
      take: limit,
      order: { id: 'DESC' },
    });
    return { pagination: paginationGenerator(count, page, limit), categories };
  }

  async findOneById(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(NotFoundMessage.category);
    return category;
  }
  async findOneBySlug(slug: string) {
    return this.categoryRepository.findOneBy({ slug });
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: {
        children: true,
      },
    });
    if (!category) throw new NotFoundException(NotFoundMessage.category);

    return category;
  }
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    image: Express.Multer.File,
  ) {
    const { parentId, show, slug, title } = updateCategoryDto;
    const category = await this.findOneById(id);
    const updateObject: DeepPartial<CategoryEntity> = {};
    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        'snappfood-image',
      );
      if (Location) {
        updateObject['image'] = Location;
        updateObject['imageKey'] = Key;
        await this.s3Service.deleteFile(category?.imageKey);
      }
    }
    if (title) updateObject['title'] = title;
    if (show && isBoolean(show)) updateObject['show'] = toBoolean(show);
    if (parentId && !isNaN(parseInt(parentId.toString()))) {
      const category = await this.findOneById(+parentId);
      if (!category) throw new NotFoundException(NotFoundMessage.category);
      updateObject['parentId'] = category.id;
    }
    if (slug) {
      const category = await this.findOneBySlug(slug);
      if (category && category.id !== id)
        throw new ConflictException(ConflictMessages.Category);
      updateObject['slug'] = slug;
    }
    await this.categoryRepository.update({ id }, updateObject);
    return {
      message: PublicMessage.Updated,
    };
  }

  async remove(id: number) {
    const category = await this.findOneById(id);
    await this.categoryRepository.delete({ id });
    return {
      message: PublicMessage.Deleted,
    };
  }
}
