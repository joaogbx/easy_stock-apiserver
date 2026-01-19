import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto', example: 'Notebook Dell' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Unidade de medida', example: 'unidade' })
  @IsString()
  @IsNotEmpty()
  measure_unit: string;

  @ApiProperty({ description: 'Quantidade inicial em estoque', example: 10, minimum: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity: number;
}
