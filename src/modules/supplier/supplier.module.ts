import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { CategoryService } from '../category/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { SupplierOtpEntity } from './entities/otp.entity';
import { JwtService } from '@nestjs/jwt';
import { CategoryModule } from '../category/category.module';
import { S3Service } from '../s3/st.service';
import { SupplierDocumentEntity } from './entities/supplier-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupplierEntity,
      SupplierOtpEntity,
      SupplierDocumentEntity,
    ]),
    CategoryModule,
  ],
  controllers: [SupplierController],
  providers: [SupplierService, JwtService, S3Service],
  exports: [SupplierService, TypeOrmModule, S3Service, JwtService],
})
export class SupplierModule {}
