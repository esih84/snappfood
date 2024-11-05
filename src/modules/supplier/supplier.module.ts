import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { CategoryService } from '../category/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { SupplierOtpEntity } from './entities/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierEntity, SupplierOtpEntity])],
  controllers: [SupplierController],
  providers: [SupplierService, CategoryService],
})
export class SupplierModule {}
