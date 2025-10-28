import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { BcryptService } from 'src/auth/hash/bcrypt.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    AuthService,
    PrismaService,
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
  ],
  controllers: [AuthController],
  exports: [JwtModule, AuthService, HashingServiceProtocol],
})
export class AuthModule {}
