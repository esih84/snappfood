import { Controller } from '@nestjs/common';
import { FoodService } from '../services/food.service';
import { SupplierAuth } from 'src/common/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('food')
@ApiTags('food')
@SupplierAuth()
export class FoodController {
  constructor(private readonly foodService: FoodService) {}
}
