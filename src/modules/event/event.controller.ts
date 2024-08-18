import {
  Controller,
  NotFoundException,
  Param,
  UseGuards,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtAuthGuard';
import { CreateAcaraEvent, EventService } from './event.service';

type AcaraEventControllerCreatePayload = Required<Omit<CreateAcaraEvent, 'id'>>;

@Controller('events')
@UseGuards(JwtAuthGuard)
export class AcaraEventController {
  constructor(private eventService: EventService) {}

  @Get()
  async findAll() {
    const data = await this.eventService.getAllEvents();
    return {
      success: true,
      errors: [],
      data,
    };
  }

  @Post()
  async createEvent(@Body() payload: AcaraEventControllerCreatePayload) {
    const create = await this.eventService.createEvent(payload);
    return {
      success: true,
      errors: [],
      data: create,
    };
  }

  @Get(':id')
  async getEvent(@Param('id') id: number) {
    const event = await this.eventService.getEventById(id);
    if (!event)
      throw new NotFoundException({
        success: false,
        errors: ['Event not found'],
      });
    return {
      success: true,
      errors: [],
      data: event,
    };
  }
}
