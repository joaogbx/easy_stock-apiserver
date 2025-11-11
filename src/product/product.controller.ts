import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CompanyIdParam } from 'src/commons/decorators/company_id.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create_product.dto';
import { UpdateProductDto } from './dto/update_product.dto';

@Controller('product')
@UseGuards(AuthGuard('jwt'))
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  getAllProducts(@CompanyIdParam() companyId: number) {
    return this.productService.getAllProducts(companyId);
  }

  @Post()
  createProduct(
    @CompanyIdParam() companyId: number,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.createProduct(companyId, createProductDto);
  }

  @Patch(':id')
  updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id', ParseIntPipe) productId: number,
  ) {
    return this.productService.updateProduct(productId, updateProductDto);
  }
  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.deleteProduct(productId);
  }
}
