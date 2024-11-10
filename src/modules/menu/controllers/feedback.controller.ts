import { Controller } from '@nestjs/common';
import { FeedbackService } from '../services/feedback.service';
import { SupplierAuth } from 'src/common/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('feedback')
@ApiTags('feedback')
@SupplierAuth()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}
}
