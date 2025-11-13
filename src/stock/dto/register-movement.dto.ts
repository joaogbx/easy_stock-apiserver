import { IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export enum TypeMovement {
  STOCK_OUT = 'STOCK_OUT',
  STOCK_IN = 'STOCK_IN',
}

export class RegisterMovementDto {
  @IsNotEmpty({ message: 'O tipo de movimento é obrigatório.' })
  @IsEnum(TypeMovement, {
    message: 'O tipo de movimento deve ser STOCK_OUT ou STOCK_IN.',
  })
  type: TypeMovement;

  @IsNotEmpty({ message: 'A quantidade é obrigatória.' })
  @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
  @IsPositive({
    message: 'A quantidade deve ser um valor positivo (maior que zero).',
  })
  quantity: number;
}
