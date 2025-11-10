import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';
import { BcryptService } from '../auth/hash/bcrypt.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    PrismaService,
    UserService,

    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
