import { ApiProperty } from '@nestjs/swagger';

export enum ItemType {
  Lost = 'lost',
  Found = 'found',
  Deposit = 'deposit',
  Misc = 'misc',
}

export class LnfEntryDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Lost Wallet' })
  name!: string;

  @ApiProperty({ example: 'lost', enum: ['lost', 'found', 'deposit', 'misc'] })
  type!: string;

  @ApiProperty({ example: 'Black leather wallet' })
  description!: string;

  @ApiProperty({ example: true })
  state!: boolean;

  @ApiProperty({ example: {}, type: 'object' })
  metadata!: object;

  @ApiProperty({ example: 'client-uuid-123' })
  externalId!: string;
}

export class CreateInventoryDto {
  @ApiProperty({ example: 'Lost Wallet' })
  readonly name!: string;

  @ApiProperty({ example: 'Black leather wallet' })
  readonly description!: string;

  @ApiProperty({ example: 'lost', enum: ['lost', 'found', 'deposit', 'misc'] })
  readonly type!: string;

  @ApiProperty({ example: true })
  readonly state!: boolean;

  @ApiProperty({ example: {}, type: 'object' })
  readonly metadata!: object;

  @ApiProperty({ example: 'client-uuid-123' })
  readonly externalId!: string;
}

export class UpdateInventoryDto {
  @ApiProperty({ example: 'Lost Wallet' })
  readonly name!: string;

  @ApiProperty({ example: 'Black leather wallet' })
  readonly description?: string;

  @ApiProperty({ example: 'found', enum: ['lost', 'found', 'deposit', 'misc'] })
  readonly type?: string;

  @ApiProperty({ example: false })
  readonly state?: boolean;

  @ApiProperty({ example: {}, type: 'object' })
  readonly metadata?: object;

  @ApiProperty({ example: 'client-uuid-123' })
  readonly externalId?: string;
}
