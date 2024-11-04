import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeor.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig())],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
