import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException({
          success: false,
          errors: [info.message || 'Unauthorized access'],
          data: null,
        })
      );
    }
    return user;
  }
}
