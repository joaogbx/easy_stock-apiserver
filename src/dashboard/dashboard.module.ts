import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { DashBoardController } from './dashboard.controller';
import { DashBoardService } from './dashboard.service';

@Module({
  imports: [AuthModule, ConfigModule.forFeature(jwtConfig)],
  providers: [PrismaService, JwtService, DashBoardService],
  controllers: [DashBoardController],
})
export class DashBoardModule {}
