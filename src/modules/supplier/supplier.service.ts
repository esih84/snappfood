import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';

import { SupplierEntity } from './entities/supplier.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SupplementaryInformationDto,
  SupplierSignUpDto,
} from './dto/supplier.dto';
import {
  BadRequestMessage,
  ConflictMessages,
  PublicMessage,
} from 'src/common/enums/messages.enum';
import { CategoryService } from '../category/category.service';
import { randomInt } from 'crypto';
import { SupplierOtpEntity } from './entities/otp.entity';
import { checkOtpDto } from '../auth/dto/otp.dto';
import { JwtService } from '@nestjs/jwt';
import { TokensPayload } from '../auth/types/payload';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SupplierStatus } from './enums/supplier-status.enum';
import { SupplierDocumentType } from './type';
import { S3Service } from '../s3/st.service';
import { SupplierDocumentEntity } from './entities/supplier-document.entity';

@Injectable({ scope: Scope.REQUEST })
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private supplierRepository: Repository<SupplierEntity>,
    @InjectRepository(SupplierOtpEntity)
    private supplierOtpRepository: Repository<SupplierOtpEntity>,
    @InjectRepository(SupplierDocumentEntity)
    private supplierDocsRepository: Repository<SupplierDocumentEntity>,
    private categoryService: CategoryService,
    private jwtService: JwtService,
    private s3Service: S3Service,
    @Inject(REQUEST) private request: Request,
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
      phone,
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
  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<TokensPayload>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (typeof payload === 'object' && payload?.id) {
        const user = await this.supplierRepository.findOneBy({
          id: payload.id,
        });
        if (!user) {
          throw new UnauthorizedException('login on your account');
        }
        return user;
      }
      throw new UnauthorizedException('login on your account');
    } catch (error) {
      throw new UnauthorizedException('login on your account');
    }
  }

  //?
  async saveSupplementaryInformation(
    informationDto: SupplementaryInformationDto,
  ) {
    const { id } = this.request.supplier;
    const { email, national_code } = informationDto;
    let supplier = await this.supplierRepository.findOneBy({ national_code });
    if (supplier && supplier.id !== id) {
      throw new ConflictException(ConflictMessages.nationalCode);
    }
    supplier = await this.supplierRepository.findOneBy({ email });
    if (supplier && supplier.id !== id) {
      throw new ConflictException(ConflictMessages.email);
    }
    await this.supplierRepository.update(
      { id },
      {
        email,
        national_code,
        status: SupplierStatus.SupplementaryInformation,
      },
    );
    return {
      message: PublicMessage.Updated,
    };
  }
  async uploadDocuments(files: SupplierDocumentType) {
    const { id } = this.request.supplier;
    const { image, acceptedDoc } = files;
    const imageResult = await this.s3Service.uploadFile(image[0], 'images');
    const docResult = await this.s3Service.uploadFile(
      acceptedDoc[0],
      'acceptedDoc',
    );
    const documentObject: DeepPartial<SupplierDocumentEntity> = {
      supplierId: id,
    };
    if (!imageResult || !docResult)
      throw new BadRequestException(BadRequestMessage.Document);
    documentObject['image'] = imageResult.Location;
    documentObject['document'] = docResult.Location;
    await this.supplierDocsRepository.insert(documentObject);
    await this.supplierRepository.update(
      { id },
      { status: SupplierStatus.UploadedDocument },
    );
    return {
      message: PublicMessage.Created,
    };
  }
}
