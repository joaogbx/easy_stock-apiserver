import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create_user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-user-dto';
import { AuthGuard } from '@nestjs/passport';
import { UserIdParam } from 'src/commons/decorators/user_id.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  async sign(@Body() signInDto: SignInDto) {
    console.log('caiu no auth');
    return this.authService.autenticate(signInDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@UserIdParam() userId: number) {
    return this.authService.me(userId);
  }
}
