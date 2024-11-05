import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsString, Length } from 'class-validator';

export class sendOtpDto {
  @ApiProperty()
  @IsMobilePhone('fa-IR', {}, { message: 'mobile number is invalid' })
  mobile: string;
}

export class checkOtpDto {
  @ApiProperty()
  @IsMobilePhone('fa-IR', {}, { message: 'mobile number is invalid' })
  mobile: string;
  @ApiProperty()
  @IsString()
  @Length(5, 5, { message: 'incorrect code' })
  code: string;
}
