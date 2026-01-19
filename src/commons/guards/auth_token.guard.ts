import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import type jwtConfigType from 'src/auth/config/jwt.config';
import { REQUEST_TOKEN_PAYLOAD } from 'src/constants';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfigType>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request: Request = context.switchToHttp().getRequest();

    const token: string = request.headers['authorization']
      .split(' ')
      .slice(1)
      .join(' ');

    if (!token) throw new UnauthorizedException('Token não encontrado');

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );

      request[REQUEST_TOKEN_PAYLOAD] = payload;

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
