import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty()
  @IsString()
  code: string;
  @ApiPropertyOptional()
  percent: number;
  @ApiPropertyOptional()
  amount: number;
  @ApiPropertyOptional()
  expires_in: number;
  @ApiPropertyOptional()
  limit: number;
}
