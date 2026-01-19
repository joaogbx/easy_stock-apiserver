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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Produtos')
@Controller('product')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  
  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso' })
  getAllProducts(@CompanyIdParam() companyId: number) {
    return this.productService.getAllProducts(companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou produto já existe' })
  createProduct(
    @CompanyIdParam() companyId: number,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.createProduct(companyId, createProductDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produto existente' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id', ParseIntPipe) productId: number,
  ) {
    return this.productService.updateProduct(productId, updateProductDto);
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar produto' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  deleteProduct(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.deleteProduct(productId);
  }
}
