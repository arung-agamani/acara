import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { AUTH_COOKIE_NAME, SECRET_KEY } from 'src/constants';

interface Payload {
  sub: string;
  username: string;
}

function fromCookie(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[AUTH_COOKIE_NAME];
  }
  return token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: fromCookie,
      ignoreExpiration: false,
      secretOrKey: SECRET_KEY,
    });
  }

  async validate(payload: Payload) {
    if (!payload) {
      throw new UnauthorizedException({
        success: false,
        errors: ['Invalid token'],
        data: null,
      });
    }
    return { userId: payload.sub, username: payload.username };
  }
}
