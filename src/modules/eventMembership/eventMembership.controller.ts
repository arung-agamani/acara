import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtAuthGuard';
import { EventMembershipService, UserRole } from './eventMembership.service';

@Controller('/events/:id/users')
@UseGuards(JwtAuthGuard)
export class EventMembershipController {
  constructor(private readonly membershipService: EventMembershipService) {}

  @Get()
  async findAll(@Param('id') eventId: number) {
    const res = await this.membershipService.getMemberships(eventId);
    return {
      success: true,
      errors: [],
      data: res,
    };
  }

  @Post()
  async addMembership(
    @Param('id') eventId: number,
    @Body() userId: number,
    @Body() role: UserRole,
  ) {
    const create = await this.membershipService.addMembership(
      eventId,
      userId,
      role,
    );
    if (!create)
      throw new BadRequestException({
        success: false,
        errors: ['No data added'],
        data: null,
      });
    return {
      success: true,
      errors: [],
      data: create,
    };
  }

  @Put(':userId')
  async updateUserRole(
    @Param('id') eventId: number,
    @Param('userId') userId: number,
    @Body() role: UserRole,
  ) {
    const put = await this.membershipService.updateUserRole(
      eventId,
      userId,
      role,
    );
    if (!put)
      throw new BadRequestException({
        success: false,
        errors: ['No data updated'],
        data: null,
      });
    return {
      success: true,
      errors: [],
      data: put,
    };
  }

  @Delete(':userId')
  async deleteMembership(
    @Param('id') eventId: number,
    @Param('userId') userId: number,
  ) {
    const del = await this.membershipService.deleteMembership(eventId, userId);
    if (!del)
      throw new BadRequestException({
        success: false,
        errors: ['No data deleted'],
        data: null,
      });
    return {
      success: true,
      errors: [],
      data: del,
    };
  }
}
