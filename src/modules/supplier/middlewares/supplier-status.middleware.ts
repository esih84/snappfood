import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ForbiddenMessage,
  UnauthorizedMessage,
} from 'src/common/enums/messages.enum';
import { SupplierService } from '../supplier.service';
import { isJWT } from 'class-validator';
import { SupplierStatus } from '../enums/supplier-status.enum';

@Injectable()
export class SupplierStatusMiddleware implements NestMiddleware {
  constructor(private supplierService: SupplierService) {}

  async use(req: Request, res: any, next: (error?: Error | any) => void) {
    const token = this.extractToken(req);
    const supplier = await this.supplierService.validateAccessToken(token);
    if (supplier.status !== SupplierStatus.Accepted) {
      throw new ForbiddenException(ForbiddenMessage.UnacceptedAccount);
    }
    next();
  }
  protected extractToken(request: Request) {
    const { authorization } = request.headers;

    if (!authorization || authorization?.trim() === '') {
      throw new UnauthorizedException(UnauthorizedMessage.login);
    }

    const [bearer, token] = authorization.split(' ');
    if (bearer.toLowerCase() !== 'bearer' || !token || !isJWT(token))
      throw new UnauthorizedException(UnauthorizedMessage.login);
    return token;
  }
}
