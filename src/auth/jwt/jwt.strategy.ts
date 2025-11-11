// src/auth/jwt.strategy.ts

import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'generated/prisma';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from 'src/prisma/prisma.service';

// Defina a interface do payload do seu JWT
export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  company_id: number;
}
export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: string;
  company_id: number | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      // 1. Onde buscar o JWT (Bearer Token no cabeçalho Authorization)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. Não ignora a expiração do token
      ignoreExpiration: false,

      // 3. A chave secreta usada para assinar/verificar o token
      secretOrKey: process.env.JWT_SECRET!, // ⚠️ Use uma variável de ambiente real
    });
  }

  // 4. Método de Validação: Chamado após o token ser decodificado e verificado
  async validate(payload: JwtPayload): Promise<PublicUser> {
    console.log(payload);
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company_id: true,
      },
    });

    if (!user) throw new UnauthorizedException('Usuário inexistente');

    return user;
  }
}
