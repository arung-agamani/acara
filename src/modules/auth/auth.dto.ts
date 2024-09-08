import { IsString, IsStrongPassword } from 'class-validator';

export class RegisterPayloadDto {
  @IsString()
  username!: string;

  @IsStrongPassword()
  password!: string;
}
