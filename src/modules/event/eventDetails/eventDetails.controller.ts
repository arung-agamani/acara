import {
  Controller,
  Param,
  UseGuards,
  Get,
  Post,
  Body,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwtAuthGuard';
import { EventDetailsService } from './eventDetails.service';
import { SetEventDetailPayloadDto } from './eventDetails.dto';

@Controller('/events/:id/eventDetail')
@UseGuards(JwtAuthGuard)
export class EventDetailsController {
  constructor(private eventDetails: EventDetailsService) {}

  @Get()
  async findAll(@Param('id') id: number) {
    const res = await this.eventDetails.getEventDetail(id);
    return {
      success: true,
      errors: [],
      data: res,
    };
  }

  @Post()
  async setEventDetail(
    @Param('id') id: number,
    @Body() payload: SetEventDetailPayloadDto,
  ) {
    const create = await this.eventDetails.setEventDetail(
      id,
      payload.key,
      payload.value,
    );
    if (!create)
      throw new BadRequestException('payload doesnt change anything');
    return {
      success: true,
      errors: [],
      data: create,
    };
  }

  @Delete(':key')
  async deleteEventDetail(@Param('id') id: number, @Param('key') key: string) {
    const del = await this.eventDetails.deleteEventDetail(id, key);
    if (!del) throw new BadRequestException('key might be invalid/not found');
    return {
      success: true,
      errors: [],
      data: del,
    };
  }
}
