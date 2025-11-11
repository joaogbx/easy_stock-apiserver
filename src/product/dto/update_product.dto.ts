import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create_user.dto';
import { UpdateUserDto } from 'src/user/dto/update_user.dto';
import { CreateProductDto } from './create_product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
