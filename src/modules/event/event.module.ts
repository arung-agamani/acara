import { Module } from '@nestjs/common';
import { AcaraEventController } from './event.controller';
import { EventService } from './event.service';
import { drizzleProvider } from '../drizzle/drizzle.provider';
import { EventDetailsModule } from './eventDetails/eventDetails.module';
import { EventMembershipModule } from '../eventMembership/eventMembership.module';

@Module({
  imports: [EventDetailsModule, EventMembershipModule],
  controllers: [AcaraEventController],
  providers: [EventService, ...drizzleProvider],
})
export class EventModule {}
