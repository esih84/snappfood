import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { UserAuth } from 'src/common/decorators/auth.decorator';
import { PaymentDto } from './dto/payment.dto';
import { Response } from 'express';
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UserAuth()
  getWayUrl(@Body() paymentDto: PaymentDto) {
    return this.paymentService.getGetWayUrl(paymentDto);
  }
  @Get('/verify')
  async verifyPayment(
    @Query('Authority') authority: string,
    @Query('Status') status: string,
    @Res() res: Response,
  ) {
    const url = await this.paymentService.verify(authority, status);
    return res.redirect(url);
  }
}
