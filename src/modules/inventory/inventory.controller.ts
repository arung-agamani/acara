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
  Logger,
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

  private readonly logger = new Logger(InventoryController.name);

  @Get()
  async findAll(@Query('type') type?: string) {
    try {
      let data;
      if (type) {
        const itemType: ItemType = type as ItemType;
        // Validate item type
        if (!Object.values(ItemType).includes(itemType)) {
          throw new BadRequestException('Invalid item type');
        }
        data = await this.inventoryService.getAllItemEntriesByType(itemType);
      } else {
        data = await this.inventoryService.getAllItemEntries();
      }
      return { success: true, errors: [], data };
    } catch (err) {
      return {
        success: false,
        errors: [/* err?.message ||  */ 'Failed to fetch inventory items'],
        data: null,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') itemId: number) {
    try {
      const data = await this.inventoryService.getItemEntry(itemId);
      return { success: true, errors: [], data };
    } catch (err) {
      return {
        success: false,
        errors: [/* err?.message ||  */ 'Failed to fetch inventory item'],
        data: null,
      };
    }
  }

  @Post()
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    this.logger.log(
      `Adding new inventory item: ${JSON.stringify(createInventoryDto)}`,
    );
    try {
      const { type, name, description, state, metadata, externalId } =
        createInventoryDto;
      const itemType: ItemType = type as ItemType;

      // Validate item type
      if (!Object.values(ItemType).includes(itemType)) {
        throw new BadRequestException('Invalid item type');
      }

      const data = await this.inventoryService.createItemEntry(
        itemType,
        name,
        description,
        state,
        metadata as Record<string, unknown>,
        externalId,
      );
      return { success: true, errors: [], data };
    } catch (err) {
      return {
        success: false,
        errors: [/* err?.message ||  */ 'Failed to create inventory item'],
        data: null,
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    try {
      const { name, description, state, metadata } = updateInventoryDto;
      const data = await this.inventoryService.updateItemEntry(
        id,
        name,
        description,
        state,
        metadata as Record<string, unknown>,
      );
      return { success: true, errors: [], data };
    } catch (err) {
      return {
        success: false,
        errors: [/* err?.message ||  */ 'Failed to update inventory item'],
        data: null,
      };
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Query('hard_delete') hardDelete: string,
  ) {
    try {
      let data;
      if (hardDelete === 'true') {
        data = await this.inventoryService.hardDeleteItemEntry(id);
      } else {
        data = await this.inventoryService.deleteItemEntry(id);
      }
      return { success: true, errors: [], data };
    } catch (err) {
      return {
        success: false,
        errors: [/* err?.message ||  */ 'Failed to delete inventory item'],
        data: null,
      };
    }
  }

  @Post('sync')
  async sync(@Body() items: CreateInventoryDto[]) {
    try {
      if (!Array.isArray(items)) {
        throw new BadRequestException(
          'Payload must be an array of inventory items',
        );
      }
      // Optionally: validate each item for required fields
      const data = await this.inventoryService.syncInventoryEntries(items);
      return { success: true, errors: [], data };
    } catch (err) {
      return {
        success: false,
        errors: [/* err?.message ||  */ 'Failed to sync inventory items'],
        data: null,
      };
    }
  }
}
