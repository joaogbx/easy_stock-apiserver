import { IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TypeMovement {
  STOCK_OUT = 'STOCK_OUT',
  STOCK_IN = 'STOCK_IN',
}

export class RegisterMovementDto {
  @ApiProperty({ 
    description: 'Tipo de movimentação de estoque', 
    enum: TypeMovement,
    example: TypeMovement.STOCK_IN 
  })
  @IsNotEmpty({ message: 'O tipo de movimento é obrigatório.' })
  @IsEnum(TypeMovement, {
    message: 'O tipo de movimento deve ser STOCK_OUT ou STOCK_IN.',
  })
  type: TypeMovement;

  @ApiProperty({ 
    description: 'Quantidade a ser movimentada', 
    example: 5,
    minimum: 1 
  })
  @IsNotEmpty({ message: 'A quantidade é obrigatória.' })
  @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
  @IsPositive({
    message: 'A quantidade deve ser um valor positivo (maior que zero).',
  })
  quantity: number;
}
