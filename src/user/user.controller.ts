import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create_user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update_user.dto';
import { AuthTokenGuard } from 'src/commons/guards/auth_token.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(updateUserDto);

    return this.userService.updateUser(id, updateUserDto);
  }

  @Get()
  async getUser() {
    return 'this.userService.findUserById(id);';
  }

  @Post()
  async registerUserByAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
