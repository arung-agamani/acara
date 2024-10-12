import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './localAuthGuard';
import { JwtAuthGuard } from './jwtAuthGuard';
import { Request as ExpressRequest, Response } from 'express';
import { AUTH_COOKIE_NAME } from 'src/constants';
import { RegisterPayloadDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterPayloadDto) {
    await this.authService.register(payload.username, payload.password);
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
    response.cookie(AUTH_COOKIE_NAME, jwt, { maxAge: 3600000, httpOnly: true });
    const user = await this.authService.me(req.user!.username);
    return {
      success: true,
      errors: [],
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('protected')
  getHello(@Request() req: ExpressRequest) {
    return `Hello ${req.user?.username}`;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: ExpressRequest) {
    const userData = await this.authService.me(req.user!.username);
    return {
      success: true,
      errors: [],
      data: userData,
    };
  }
}
