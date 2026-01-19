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
import { CompanyIdParam } from 'src/commons/decorators/company_id.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Usuários')
@Controller('user')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(updateUserDto);
    return this.userService.updateUser(id, updateUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  async getUsers(@CompanyIdParam() companyId) {
    return this.userService.findAllByCompany(companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário (apenas administradores)' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou email já existe' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas administradores' })
  async registerUserByAdmin(
    @Body() createUserDto: CreateUserDto,
    @CompanyIdParam() companyId,
  ) {
    return this.userService.createUser(createUserDto, companyId);
  }
}
