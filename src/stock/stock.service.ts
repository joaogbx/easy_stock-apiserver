import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterMovementDto, TypeMovement } from './dto/register-movement.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { Prisma } from '@prisma/client';
import { GetMovementsFilterDto } from './dto/get-movement.dto';

@Injectable()
export class StockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async registerMovement(
    productId: number,
    companyId: number,
    registerMovementDto: RegisterMovementDto,
    userId: number,
  ) {
    const product = await this.productService.getProductById(productId);

    const { type, quantity } = registerMovementDto;
    let newQuantity: number;

    if (type === TypeMovement.STOCK_OUT) {
      if (quantity > product.quantity) {
        throw new BadRequestException(
          `Estoque insuficiente. Disponível: ${product.quantity}, Solicitado: ${quantity}`,
        );
      }
      newQuantity = product.quantity - quantity;
    }

    if (type === TypeMovement.STOCK_IN) {
      newQuantity = product.quantity + quantity;
    }

    const transactionResult = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        await tx.product.update({
          where: { id: productId },
          data: { quantity: newQuantity },
        });

        const stockMovement = await tx.stockMovement.create({
          data: {
            company: { connect: { id: companyId } },
            product: { connect: { id: productId } },
            user: { connect: { id: userId } },
            ...registerMovementDto,
            ...registerMovementDto, // type e quantity
          },
          include: {
            product: true,
          },
        });

        return stockMovement;
      },
    );

    return transactionResult;
  }

  async getAllMovements(
    filters: GetMovementsFilterDto,
    companyId: number,
    userId?: number,
  ) {
    const whereConditions: any = {
      company_id: companyId,
    };

    console.log(filters);

    if (userId) {
      whereConditions.user_id = userId;
    }

    if (filters.startDate || filters.endDate) {
      whereConditions.created_at = {};

      if (filters.startDate) {
        whereConditions.created_at.gte = filters.startDate;
      }

      if (filters.endDate) {
        whereConditions.created_at.lte = filters.endDate;
      }
    }

    const movements = await this.prisma.stockMovement.findMany({
      where: whereConditions,
      include: {
        product: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    //if (movements.length === 0) {
    //  const message = userId
    //    ? 'Sem movimentações encontradas para este usuário.'
    //    : 'Sem movimentações encontradas para esta companhia.';

    //  throw new NotFoundException(message);
    //}
    console.log(movements);
    return movements;
  }
}
