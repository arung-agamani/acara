import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwtAuthGuard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll() {
    const data = await this.usersService.findAll();
    return {
      success: true,
      data,
    };
  }

  @Post()
  async createUser(
    @Body('username') name: string,
    @Body('password') password: string,
  ) {
    return this.usersService.createUser(name, password);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    return {
      success: true,
      data: user,
    };
  }

  @Post(':id')
  async updateUser(
    @Param('id') id: number,
    @Body('displayName') displayName: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.usersService.updateUserDisplayName(id, displayName, isActive);
  }
}
