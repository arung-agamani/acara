import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { UsersService } from '../users/users.service';
import { UsersController } from '../users/users.controller';

@Module({
  providers: [PasswordService, UsersService],
  controllers: [UsersController],
})
export class PasswordModule {}
