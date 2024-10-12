import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwtAuthGuard';
import { UpdateUserDto } from './users.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll() {
    const data = await this.usersService.findAll();
    return {
      success: true,
      data,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  async createUser(
    @Body('username') name: string,
    @Body('password') password: string,
  ) {
    return this.usersService.createUser(name, password);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
  })
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    return {
      success: true,
      data: user,
    };
  }

  @Post(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { displayName, isActive } = updateUserDto;
    return this.usersService.updateUserDisplayName(id, displayName, isActive);
  }
}
