import { Module } from '@nestjs/common';
import { AcaraEventController } from './event.controller';
import { EventService } from './event.service';
import { drizzleProvider } from '../drizzle/drizzle.provider';
import { EventDetailsModule } from './eventDetails/eventDetails.module';

@Module({
  imports: [EventDetailsModule],
  controllers: [AcaraEventController],
  providers: [EventService, ...drizzleProvider],
})
export class EventModule {}
