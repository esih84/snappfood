import {
  Controller,
  Post,
  Body,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import {
  SupplementaryInformationDto,
  SupplierSignUpDto,
  UploadDocsDto,
} from './dto/supplier.dto';
import { checkOtpDto } from '../auth/dto/otp.dto';
import { SupplierAuth } from 'src/common/decorators/auth.decorator';
import { ApiConsumes } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { UploadFieldsS3 } from 'src/common/interceptors/upload-file.interceptor';
import { SupplierDocumentType } from './type';

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

  @Put('upload-documents')
  @SupplierAuth()
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(
    UploadFieldsS3([
      { name: 'acceptedDoc', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  uploadDocuments(
    @Body() docDto: UploadDocsDto,
    @UploadedFiles() files: SupplierDocumentType,
  ) {
    return this.supplierService.uploadDocuments(files);
  }
}
