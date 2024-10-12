import { ApiProperty } from '@nestjs/swagger';

/* eslint-disable @typescript-eslint/no-namespace */
export class GetUserDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  username!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  isActive!: boolean;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe' })
  readonly displayName!: string;

  @ApiProperty({ example: true })
  readonly isActive!: boolean;
}

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      displayName: string;
      createdAt: Date;
      updatedAt: Date;
      isActive: boolean;
    }
  }
}
