import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../password/password.service';
import { JwtStrategy } from './jwtStrategy';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './localStrategy';
import { SECRET_KEY } from 'src/constants';
import { drizzleProvider } from '../drizzle/drizzle.provider';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    AuthService,
    UsersService,
    PasswordService,
    LocalStrategy,
    JwtStrategy,
    ...drizzleProvider,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
