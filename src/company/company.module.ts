import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';

@Module({
  imports: [AuthModule, ConfigModule.forFeature(jwtConfig)],
  providers: [CompanyService, PrismaService, JwtService],
  controllers: [CompanyController],
})
export class CompanyModule {}
