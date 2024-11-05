import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIdentityCard,
  IsMobilePhone,
  IsOptional,
  Length,
} from 'class-validator';

export class SupplierSignUpDto {
  @ApiProperty()
  categoryId: number;
  @ApiProperty()
  @Length(3, 50)
  manager_name: string;
  @ApiProperty()
  @Length(3, 50)
  manager_family: string;
  @ApiProperty()
  @Length(3, 50)
  store_name: string;
  @ApiProperty()
  @IsMobilePhone('fa-IR', {}, { message: 'شماره موبایل نامعتبر است' })
  phone: string;
  @ApiProperty()
  city: string;
  @ApiPropertyOptional()
  @IsOptional()
  invite_code: string;
}

export class SupplementaryInformationDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsIdentityCard('IR')
  national_code: string;
}

export class UploadDocsDto {
  @ApiProperty({ format: 'binary' })
  image: string;
  @ApiProperty({ format: 'binary' })
  acceptedDoc: string;
}
