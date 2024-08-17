/* eslint-disable @typescript-eslint/no-namespace */
export class GetUserDto {
  id: number;
  username: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
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
