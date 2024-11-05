import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, Length } from 'class-validator';

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
  @ApiProperty()
  invite_code: string;
}
