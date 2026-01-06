import { IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMovementsFilterDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  mine?: string;
}
