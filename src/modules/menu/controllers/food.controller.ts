import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { FoodService } from '../services/food.service';
import { SupplierAuth } from 'src/common/decorators/auth.decorator';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { CreateFoodDto, UpdateFoodDto } from '../dto/food.dto';
import { UploadFileS3 } from 'src/common/interceptors/upload-file.interceptor';
import { UploadImage } from 'src/common/decorators/upload-file.decorator';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('food')
@ApiTags('food')
@SupplierAuth()
export class FoodController {
  constructor(private readonly foodService: FoodService) {}
  @Post()
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(UploadFileS3('image'))
  create(
    @Body() foodDto: CreateFoodDto,
    @UploadImage()
    image: Express.Multer.File,
  ) {
    return this.foodService.create(foodDto, image);
  }
  @Put(':id')
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(UploadFileS3('image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() foodDto: UpdateFoodDto,
    @UploadImage()
    image: Express.Multer.File,
  ) {
    return this.foodService.update(id, foodDto, image);
  }
  @Get('/get-menu-by-id/:supplierId')
  @SkipAuth()
  findAll(@Param('supplierId', ParseIntPipe) id: number) {
    return this.foodService.findAll(id);
  }
  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.foodService.findOne(id);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.foodService.remove(id);
  }
}
