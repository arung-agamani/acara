import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
  async hashPassword(password: string) {
    try {
      return await argon2.hash(password);
    } catch (error) {
      throw new Error('Error when hashing password');
    }
  }

  async verifyPassword(digest: string, password: string) {
    try {
      return await argon2.verify(digest, password);
    } catch (error) {
      throw new Error('Error verifying password');
    }
  }
}
