import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { drizzleProvider } from '../drizzle/drizzle.provider';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, ...drizzleProvider],
})
export class InventoryModule {}
