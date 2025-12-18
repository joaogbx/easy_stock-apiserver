import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  measure_unit: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity: number;
}
