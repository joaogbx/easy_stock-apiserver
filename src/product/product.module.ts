import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ProductService, PrismaService, JwtStrategy],
  controllers: [ProductController],
  imports: [AuthModule],
})
export class ProductModule {}
