import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create_product.dto';
import { UpdateProductDto } from './dto/update_product.dto';
// Você pode precisar importar as classes de erro do Prisma se
// o seu Exception Filter não estiver configurado globalmente.
// Exemplo: import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProductById(productId: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product) throw new NotFoundException('Produto inexistente');

    return product;
  }

  async getAllProducts(companyId: number) {
    const products = await this.prisma.product.findMany({
      where: {
        company_id: companyId,
      },
    });

    return products;
  }

  async createProduct(companyId: number, createProductDto: CreateProductDto) {
    const hasProduct = await this.prisma.product.findFirst({
      where: {
        name: createProductDto.name,
      },
    });

    if (hasProduct) {
      throw new BadRequestException('Produto já existente');
    }

    const newProduct = await this.prisma.product.create({
      data: {
        ...createProductDto,
        company_id: companyId,
      },
    });

    return newProduct;
  }

  async updateProduct(productId: number, updateProductDto: UpdateProductDto) {
    const hasProduct = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!hasProduct) {
      throw new NotFoundException('Produto não existe');
    }

    const updatedProduct = await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...updateProductDto,
      },
    });

    return updatedProduct;
  }

  async deleteProduct(productId: number) {
    try {
      const deletedProduct = await this.prisma.product.delete({
        where: {
          id: productId,
        },
      });
      return deletedProduct;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Produto não existe');
      }
      throw error;
    }
  }
}
