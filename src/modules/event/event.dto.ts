import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CreateEventPayloadDto {
  name!: string;
  description!: string;

  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @Type(() => Date)
  @IsDate()
  endDate!: Date;
}
