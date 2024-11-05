import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { checkOtpDto, sendOtpDto } from './dto/otp.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/send-otp')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  sendOtp(@Body() otpDto: sendOtpDto) {
    return this.authService.sendOtp(otpDto);
  }
  @Post('/check-otp')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  checkOtp(@Body() otpDto: checkOtpDto) {
    return this.authService.checkOtp(otpDto);
  }
}
