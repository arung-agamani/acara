import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { drizzleProvider } from '../drizzle/drizzle.provider';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, ...drizzleProvider],
  exports: [],
})
export class UsersModule {}
