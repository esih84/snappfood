import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { SupplierEntity } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierSignUpDto } from './dto/supplier.dto';
import {
  ConflictMessages,
  PublicMessage,
} from 'src/common/enums/messages.enum';
import { CategoryService } from '../category/category.service';
import { randomInt } from 'crypto';
import { SupplierOtpEntity } from './entities/otp.entity';
import { checkOtpDto } from '../auth/dto/otp.dto';
import { JwtService } from '@nestjs/jwt';
import { TokensPayload } from '../auth/types/payload';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private supplierRepository: Repository<SupplierEntity>,
    @InjectRepository(SupplierOtpEntity)
    private supplierOtpRepository: Repository<SupplierOtpEntity>,
    private categoryService: CategoryService,
    private jwtService: JwtService,
  ) {}
  async signup(signUpDto: SupplierSignUpDto) {
    const {
      store_name,
      manager_name,
      manager_family,
      phone,
      city,
      invite_code,
      categoryId,
    } = signUpDto;
    const supplier = await this.supplierRepository.findOneBy({ phone });
    if (supplier) throw new ConflictException(ConflictMessages.supplier);
    const category = await this.categoryService.findOneById(categoryId);
    let agent: SupplierEntity = null;
    if (invite_code) {
      agent = await this.supplierRepository.findOneBy({ invite_code });
    }
    const mobileNumber = parseInt(phone);
    let account = this.supplierRepository.create({
      manager_name,
      manager_family,
      store_name,
      city,
      CategoryId: category.id,
      agentId: agent?.id ?? null,
      invite_code: mobileNumber.toString(32).toUpperCase(),
    });
    account = await this.supplierRepository.save(account);
    await this.createOtpForSupplier(account);
    return {
      message: PublicMessage.SendOtpSuccessfully,
    };
  }
  async checkOtp(otpDto: checkOtpDto) {
    const { mobile, code } = otpDto;
    const supplier = await this.supplierRepository.findOne({
      where: { phone: mobile },
      relations: { otp: true },
    });
    const now = new Date();
    if (!supplier || !supplier?.otp)
      throw new UnauthorizedException('not found Account');
    const otp = supplier?.otp;
    if (otp?.code !== code)
      throw new UnauthorizedException('otp code is incorrect');
    if (otp.expires_in < now)
      throw new UnauthorizedException(' Otp code is expired');
    if (!supplier.mobile_verified) {
      await this.supplierRepository.update(
        { id: supplier.id },
        { mobile_verified: true },
      );
    }
    const { refreshToken, accessToken } = this.makeTokenForSupplier({
      id: supplier.id,
    });
    return {
      accessToken,
      refreshToken,
      message: 'login successfully',
    };
  }
  async createOtpForSupplier(supplier: SupplierEntity) {
    const code = randomInt(10000, 99999).toString();

    const expires_in = new Date(new Date().getTime() + 1000 * 60 * 2);
    let otp = await this.supplierOtpRepository.findOneBy({
      supplierId: supplier.id,
    });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException('otp code not expired');
      }
      otp.code = code;
      otp.expires_in = expires_in;
    } else {
      otp = this.supplierOtpRepository.create({
        code,
        expires_in,
        supplierId: supplier.id,
      });
    }
    await this.supplierOtpRepository.save(otp);
    supplier.otpId = otp.id;
    supplier = await this.supplierRepository.save(supplier);
  }
  makeTokenForSupplier(payload: TokensPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '30d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '1y',
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
