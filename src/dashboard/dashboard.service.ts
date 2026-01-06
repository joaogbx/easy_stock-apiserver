import { PrismaService } from 'src/prisma/prisma.service';
import { subDays } from 'date-fns';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashBoardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashBoard(companyId: number) {
    const thirtyDaysAgo = subDays(new Date(), 30);

    // 1. Quantidade de SAÍDAS (STOCK_OUT) nos últimos 30 dias
    // Contamos quantos registros de movimentação do tipo OUT existem

    const stockOutCount = await this.prisma.stockMovement.count({
      where: {
        company_id: companyId,
        type: 'STOCK_OUT',
        created_at: { gte: thirtyDaysAgo },
      },
    });

    const stockInCount = await this.prisma.stockMovement.count({
      where: {
        company_id: companyId,
        type: 'STOCK_IN',
        created_at: { gte: thirtyDaysAgo },
      },
    });
    // 2. Qtd de produtos cadastrados
    const totalProducts = await this.prisma.product.count({
      where: { company_id: companyId },
    });

    // 3. Total de itens (Soma da coluna 'quantity' de todos os produtos)
    const aggregate = await this.prisma.product.aggregate({
      where: { company_id: companyId },
      _sum: {
        quantity: true,
      },
    });

    return {
      stockOutCount,
      stockInCount,
      totalProducts,
      totalStockQuantity: aggregate._sum.quantity ?? 0,
    };
  }
}
