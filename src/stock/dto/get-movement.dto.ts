import { IsOptional, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetMovementsFilterDto {
  @ApiPropertyOptional({ 
    description: 'Data de início para filtrar movimentações', 
    example: '2024-01-01T00:00:00Z' 
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ 
    description: 'Data de fim para filtrar movimentações', 
    example: '2024-12-31T23:59:59Z' 
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({ 
    description: 'Filtrar apenas movimentações do usuário atual', 
    example: 'true' 
  })
  @IsOptional()
  @IsString()
  mine?: string;
}
