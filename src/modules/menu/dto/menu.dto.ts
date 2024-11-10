import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty()
  @Length(3, 30)
  title: string;
}
