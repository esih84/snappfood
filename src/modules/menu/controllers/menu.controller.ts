import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateMenuDto } from '../dto/menu.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { SupplierAuth } from 'src/common/decorators/auth.decorator';

@Controller('menu')
@ApiTags('menu')
@SupplierAuth()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() menuDto: CreateMenuDto) {
    return this.menuService.create(menuDto);
  }
  @Put(':id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() menuDto: CreateMenuDto,
  ) {
    return this.menuService.update(id, menuDto);
  }
  @Get()
  findAll() {
    return this.menuService.findAll();
  }
  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOneById(id);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}
