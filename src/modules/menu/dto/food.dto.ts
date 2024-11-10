import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class CreateFoodDto {
  @ApiProperty()
  @Length(3, 30)
  name: string;
  @ApiProperty({ format: 'binary' })
  image: string;
  @ApiProperty()
  @Length(30, 100)
  description: string;
  @ApiProperty({ format: 'numeric' })
  price: number;
  @ApiProperty({ format: 'numeric' })
  discount: number;
  @ApiProperty()
  menuId: number;
}

export class UpdateFoodDto extends PartialType(CreateFoodDto) {}
