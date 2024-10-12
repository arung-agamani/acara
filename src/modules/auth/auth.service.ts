import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../password/password.service';
import { JwtService } from '@nestjs/jwt';
import { GetUserDto } from '../users/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);
    if (
      user &&
      (await this.passwordService.verifyPassword(user.password, password))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: GetUserDto) {
    const payload = { username: user.username, sub: user.id };
    const jwt = this.jwtService.sign(payload);
    return jwt;
  }

  async register(username: string, password: string) {
    const digest = await this.passwordService.hashPassword(password);
    return await this.userService.createUser(username, digest);
  }

  async me(username: string) {
    const user = await this.userService.getUserByUsername(username);
    const { password, ...result } = user!;
    return result;
  }
}
