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
  contractDto,
  SupplementaryInformationDto,
  SupplierSignUpDto,
  UploadDocsDto,
} from './dto/supplier.dto';
import { checkOtpDto, sendOtpDto } from '../auth/dto/otp.dto';
import { SupplierAuth } from 'src/common/decorators/auth.decorator';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import {
  UploadFieldsS3,
  UploadFileS3,
} from 'src/common/interceptors/upload-file.interceptor';
import { SupplierDocumentType } from './type';
import { UploadImage } from 'src/common/decorators/upload-file.decorator';

@Controller('supplier')
@ApiTags('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post('/signup')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  signup(@Body() supplierDto: SupplierSignUpDto) {
    return this.supplierService.signup(supplierDto);
  }
  @Post('/send-otp')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  sendOtp(@Body() otpDto: sendOtpDto) {
    return this.supplierService.sendOtp(otpDto);
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

  @Put('register-contract')
  @SupplierAuth()
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(UploadFileS3('image'))
  registerContract(
    @Body() contractDto: contractDto,
    @UploadImage() image: Express.Multer.File,
  ) {
    return this.supplierService.registerContract(image);
  }
}
