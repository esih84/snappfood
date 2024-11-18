import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';
import { BadRequestMessage } from 'src/common/enums/messages.enum';

@Injectable()
export class ZarinnpalService {
  constructor(private httpService: HttpService) {}
  async sendRequest(data?: any) {
    const { amount, description, user } = data;
    const options = {
      merchant_id: process.env.ZARINNPAL_MERCHANT_ID,
      //? if use تومن amount*10
      amount: amount * 10,
      description,
      metadata: {
        email: user?.email ?? '',
        mobile: user?.mobile ?? '',
      },
      callback_url: process.env.ZARINNPAL_CALLBACK_URL,
    };
    const result = await lastValueFrom(
      this.httpService
        .post(process.env.ZARINNPAL_REQUEST_URL, options, {})
        .pipe(map((res) => res.data))
        .pipe(
          catchError((error) => {
            console.log(error);
            throw new InternalServerErrorException('zarinnpal error');
          }),
        ),
    );
    const { authority, code } = result.data;
    if (code == 100 && authority) {
      return {
        code,
        authority,
        getWayURL: `${process.env.ZARINNPAL_GETWAY_URL}/${authority}`,
      };
    }
    throw new BadRequestException(BadRequestMessage.ZarinnpalConnection);
  }
  async verifyRequest(data?: any) {
    const option = {
      authority: data.authority,
      amount: data.amount,
      merchant_id: process.env.ZARINNPAL_MERCHANT_ID,
    };
    const result = await lastValueFrom(
      this.httpService
        .post(process.env.ZARINNPAL_VERIFY_URL, option, {})
        .pipe(map((res) => res.data))
        .pipe(
          catchError((error) => {
            console.log(error);
            throw new InternalServerErrorException('zarinnpal field');
          }),
        ),
    );
    return result;
  }
}
