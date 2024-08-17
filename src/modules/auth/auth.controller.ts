import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './localAuthGuard';
import { JwtAuthGuard } from './jwtAuthGuard';
import { Request as ExpressRequest, Response } from 'express';
import { AUTH_COOKIE_NAME } from 'src/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    await this.authService.register(username, password);
    return {
      success: true,
      data: 'User registered successfully',
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.login(req.user!);
    response.cookie(AUTH_COOKIE_NAME, jwt);
    return {
      success: true,
      message: 'Logged in',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('protected')
  getHello(@Request() req) {
    return `Hello ${req.user.username}`;
  }
}
