import { Module } from '@nestjs/common';
import { MenuService } from './services/menu.service';
import { MenuController } from './menu.controller';
import { FeedbackService } from './services/feedback.service';

@Module({
  controllers: [MenuController],
  providers: [MenuService, FeedbackService],
})
export class MenuModule {}
