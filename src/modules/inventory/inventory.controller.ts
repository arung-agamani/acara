import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  CreateInventoryDto,
  ItemType,
  UpdateInventoryDto,
} from './lnfEntry.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll(@Query('type') type?: string) {
    if (type) {
      const itemType: ItemType = type as ItemType;
      // Validate item type
      if (!Object.values(ItemType).includes(itemType)) {
        throw new BadRequestException('Invalid item type');
      }
      return this.inventoryService.getAllItemEntriesByType(itemType);
    } else {
      return this.inventoryService.getAllItemEntries();
    }
  }

  @Get(':id')
  findOne(@Param('id') itemId: number) {
    return this.inventoryService.getItemEntry(itemId);
  }

  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto) {
    const { type, name, description, state, metadata } = createInventoryDto;
    const itemType: ItemType = type as ItemType;

    // Validate item type
    if (!Object.values(ItemType).includes(itemType)) {
      throw new BadRequestException('Invalid item type');
    }

    return this.inventoryService.createItemEntry(
      itemType,
      name,
      description,
      state,
      metadata as Record<string, unknown>,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    const { name, description, state, metadata } = updateInventoryDto;
    return this.inventoryService.updateItemEntry(
      id,
      name,
      description,
      state,
      metadata as Record<string, unknown>,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Query('hard_delete') hardDelete: string) {
    if (hardDelete === 'true') {
      return this.inventoryService.hardDeleteItemEntry(id);
    } else {
      return this.inventoryService.deleteItemEntry(id);
    }
  }
}
