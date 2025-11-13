import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';

@Module({
  providers: [StockService, PrismaService, JwtStrategy],
  controllers: [StockController],
  imports: [ProductModule, AuthModule],
})
export class StockModule {}
