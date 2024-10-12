import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventModule } from './modules/event/event.module';
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
  imports: [UsersModule, AuthModule, EventModule, InventoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
