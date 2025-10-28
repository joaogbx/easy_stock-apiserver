import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin-user-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { USER_SELECT_FIELDS } from 'src/constants';
import { JwtService } from '@nestjs/jwt';
import type jwtConfigType from './config/jwt.config';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hash: HashingServiceProtocol,
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfigType>,
  ) {}

  async autenticate(signInDto: SignInDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: signInDto.email,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);
    }

    const validatePassword = await this.hash.compare(
      signInDto.password,
      user!.password_hash,
    );

    if (!validatePassword) {
      throw new HttpException(
        'Login ou senha incorretos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        audience: this.jwtConfiguration.audience,
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: '30d',
      },
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      companye_id: user.companye_id,
      role: user.role,
      token: token,
    };
  }
}
