import { HttpModule, HttpService } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ZarinnpalService } from './zarinnpal.service';
@Global()
@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
      timeout: 5000,
    }),
  ],
  exports: [ZarinnpalService],
  providers: [ZarinnpalService],
})
export class HttpApiModule {}
