import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { checkOtpDto, sendOtpDto } from './dto/otp.dto';
import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { TokensPayload } from './types/payload';
import { UserEntity } from '../user/entities/user.entity';
import { OTPEntity } from '../user/entities/otp.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OTPEntity) private otpRepository: Repository<OTPEntity>,
    private jwtService: JwtService,
  ) {}
  async sendOtp(otpDto: sendOtpDto) {
    const { mobile } = otpDto;
    let user = await this.userRepository.findOneBy({ mobile });

    if (!user) {
      user = this.userRepository.create({
        mobile,
      });
      await this.userRepository.save(user);
    }
    await this.createOtpForUser(user);
    return {
      message: 'send code successfully',
    };
  }
  async checkOtp(otpDto: checkOtpDto) {
    const { mobile, code } = otpDto;
    const user = await this.userRepository.findOne({
      where: { mobile },
      relations: { otp: true },
    });
    const now = new Date();
    if (!user || !user?.otp)
      throw new UnauthorizedException('not found Account');
    const otp = user?.otp;
    if (otp?.code !== code)
      throw new UnauthorizedException('otp code is incorrect');
    if (otp.expires_in < now)
      throw new UnauthorizedException(' Otp code is expired');
    if (!user.mobile_verified) {
      await this.userRepository.update(
        { id: user.id },
        { mobile_verified: true },
      );
    }
    const { refreshToken, accessToken } = this.makeTokenForUser({
      id: user.id,
    });
    return {
      accessToken,
      refreshToken,
      message: 'login successfully',
    };
  }
  async createOtpForUser(user: UserEntity) {
    const code = randomInt(10000, 99999).toString();

    const expires_in = new Date(new Date().getTime() + 1000 * 60 * 2);
    let otp = await this.otpRepository.findOneBy({ userId: user.id });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException('otp code not expired');
      }
      otp.code = code;
      otp.expires_in = expires_in;
    } else {
      otp = this.otpRepository.create({
        code,
        expires_in,
        userId: user.id,
      });
    }
    await this.otpRepository.save(otp);
    user.otpId = otp.id;
    user = await this.userRepository.save(user);
  }
  makeTokenForUser(payload: TokensPayload) {
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
        const user = await this.userRepository.findOneBy({ id: payload.id });
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

  async checkEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) throw new ConflictException('email is already exist');
  }
  async checkMobile(mobile: string) {
    const user = await this.userRepository.findOneBy({ mobile });
    if (user) throw new ConflictException('mobile is already exist');
  }
}
