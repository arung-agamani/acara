import { Module } from '@nestjs/common';
import { EventMembershipController } from './eventMembership.controller';
import { EventMembershipService } from './eventMembership.service';
import { drizzleProvider } from '../drizzle/drizzle.provider';

@Module({
  controllers: [EventMembershipController],
  providers: [EventMembershipService, ...drizzleProvider],
})
export class EventMembershipModule {}
