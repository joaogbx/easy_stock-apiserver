import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/signin-user-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { USER_SELECT_FIELDS } from 'src/constants';
import { JwtService } from '@nestjs/jwt';
import type jwtConfigType from './config/jwt.config';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/create_user.dto';

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

    //if (!user?.company_id)
    //  throw new HttpException('Usuário sem companhia', HttpStatus.FORBIDDEN);
    //
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
        company_id: user.company_id,
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
      role: user.role,
      company_id: user.company_id,
      token: token,
    };
  }

  async me(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        company: true,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);
    }

    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
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
      role: user.role,
      company_id: user.company_id,
      token: token,
      company: user.company,
    };
  }

  async register(createUserDto: CreateUserDto) {
    // const user = await this.prisma.user.findFirst({
    //   where: {
    //     email: createUserDto.email,
    //   },
    // });
    //
    // if (user?.id)
    //   throw new HttpException('Usuário já existe', HttpStatus.BAD_REQUEST);
    //
    const passwordHash = await this.hash.hash(createUserDto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        role: createUserDto.role,
        password_hash: passwordHash,
      },
      select: USER_SELECT_FIELDS,
    });

    const token = await this.jwtService.signAsync(
      {
        sub: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      {
        audience: this.jwtConfiguration.audience,
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: '30d',
      },
    );

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      created_at: newUser.created_at,
      role: newUser.role,
      token: token,
    };
  }
}
