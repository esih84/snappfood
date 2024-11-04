import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  slug: string;
  @ApiProperty({ format: 'binary' })
  image: string;
  @ApiProperty({ type: 'boolean' })
  show: boolean;
  @ApiPropertyOptional({ nullable: true })
  parentId: number;
}
