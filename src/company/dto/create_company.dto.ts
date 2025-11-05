// src/company/dto/create-company.dto.ts

import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome da empresa é obrigatório.' })
  name: string;

  @IsNotEmpty({ message: 'ID do usuário obrigatório.' })
  owner_id: number;

  //@ApiProperty({
  //  description: 'URL de uma imagem ou logo para a empresa.',
  //  example: 'https://seusite.com/logo.png',
  //})
  //@IsString({ message: 'A URL deve ser uma string.' })
  //@IsUrl({}, { message: 'Formato de URL inválido.' })
  //@IsNotEmpty({ message: 'A URL da imagem é obrigatória.' })
  //image_url: string;
}
