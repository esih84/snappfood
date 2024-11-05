import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierSignUpDto } from './dto/supplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  signup(@Body() supplierDto: SupplierSignUpDto) {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
