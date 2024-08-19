import { Module } from '@nestjs/common';
import { EventDetailsController } from './eventDetails.controller';
import { EventDetailsService } from './eventDetails.service';
import { drizzleProvider } from 'src/modules/drizzle/drizzle.provider';

@Module({
  controllers: [EventDetailsController],
  providers: [EventDetailsService, ...drizzleProvider],
})
export class EventDetailsModule {}
