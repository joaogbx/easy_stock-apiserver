import {
  Body,
  Controller,
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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Post()
  @UseGuards(AuthTokenGuard)
  async registerUserByAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
