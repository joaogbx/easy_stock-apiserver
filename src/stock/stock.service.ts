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
    console.log('PRODUUUUUUUUUUUTO', productId);
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
        });

        return stockMovement;
      },
    );

    return transactionResult;
  }

  async getAllMovements(companyId: number, userId?: number) {
    const whereCondition: any = { company_id: companyId };

    if (userId) whereCondition.user_id = userId;

    const movements = this.prisma.stockMovement.findMany({
      where: whereCondition,
      include: {
        product: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!movements)
      throw new NotFoundException('Sem movimentações dessa companhia');

    return movements;
  }
}
