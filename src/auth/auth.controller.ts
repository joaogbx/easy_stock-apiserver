import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create_user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  async sign(@Body() signInDto: SignInDto) {
    return this.authService.autenticate(signInDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
