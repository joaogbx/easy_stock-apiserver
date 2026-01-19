import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva', maxLength: 70 })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MaxLength(70)
  name: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao@empresa.com' })
  @IsEmail({}, { message: 'O e-mail deve ser um endereço válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'senha123', minLength: 8 })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  password: string;

  @ApiProperty({ description: 'Função do usuário', enum: UserRole, example: UserRole.USER })
  @IsEnum(UserRole, { message: 'A função (role) deve ser ADMIN ou USER.' })
  @IsNotEmpty({ message: 'A função (role) é obrigatória.' })
  role: string;
}
