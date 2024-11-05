import { Controller, Post, Body } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import {
  SupplementaryInformationDto,
  SupplierSignUpDto,
} from './dto/supplier.dto';
import { checkOtpDto } from '../auth/dto/otp.dto';
import { SupplierAuth } from 'src/common/decorators/auth.decorator';
import { ApiConsumes } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post('/signup')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  signup(@Body() supplierDto: SupplierSignUpDto) {
    return this.supplierService.signup(supplierDto);
  }
  @Post('/check-otp')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  checkOtp(@Body() otpDto: checkOtpDto) {
    return this.supplierService.checkOtp(otpDto);
  }
  @Post('/supplementary-information')
  @SupplierAuth()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  SupplementaryInformation(
    @Body() informationDto: SupplementaryInformationDto,
  ) {
    return this.supplierService.saveSupplementaryInformation(informationDto);
  }
}
