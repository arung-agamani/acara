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
  async findOne(@Param('id') itemId: string) {
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
      const { id, type, name, description, state, metadata, externalId } =
        createInventoryDto;
      const itemType: ItemType = type as ItemType;

      // Validate item type
      if (!Object.values(ItemType).includes(itemType)) {
        throw new BadRequestException('Invalid item type');
      }

      const data = await this.inventoryService.createItemEntry(
        id,
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
      const { id, name, description, state, metadata } = updateInventoryDto;
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
    @Param('id') id: string,
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
  async sync(@Body() items: any[]) {
    try {
      if (!Array.isArray(items)) {
        throw new BadRequestException(
          'Payload must be an array of inventory items',
        );
      }
      // Adapt each item to lnfEntry shape + metadata
      const lnfFields = [
        'id',
        'name',
        'description',
        'type',
        'state',
        'externalId',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'metadata',
      ];
      const adaptedItems = items.map((item) => {
        // Extract lnfEntry fields
        const lnfEntryData: Record<string, any> = {};
        for (const key of lnfFields) {
          if (item[key] !== undefined) lnfEntryData[key] = item[key];
        }
        // Everything else goes into metadata
        const extraFields = Object.keys(item).filter(
          (key) => !lnfFields.includes(key),
        );
        const extraMetadata: Record<string, any> = {};
        for (const key of extraFields) {
          extraMetadata[key] = item[key];
        }
        // Merge with existing metadata if present
        lnfEntryData.metadata = {
          ...(typeof lnfEntryData.metadata === 'object' && lnfEntryData.metadata
            ? lnfEntryData.metadata
            : {}),
          ...extraMetadata,
        };
        return lnfEntryData;
      });
      // Ensure adaptedItems are typed as any[] to bypass DTO validation
      const data = await this.inventoryService.syncInventoryEntries(
        adaptedItems as any[],
      );
      return { success: true, errors: [], data };
    } catch (err) {
      return {
        success: false,
        errors: [err || 'Failed to sync inventory items'],
        data: null,
      };
    }
  }
}
