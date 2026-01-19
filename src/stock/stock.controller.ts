import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompanyIdParam } from 'src/commons/decorators/company_id.decorator';
import { RegisterMovementDto } from './dto/register-movement.dto';
import { StockService } from './stock.service';
import { AuthGuard } from '@nestjs/passport';
import { UserIdParam } from 'src/commons/decorators/user_id.decorator';
import { UserRoleDecorator } from 'src/commons/decorators/user_role.decorator';
import { GetMovementsFilterDto } from './dto/get-movement.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Estoque')
@Controller('stock/movements')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post(':id')
  @ApiOperation({ summary: 'Registrar movimentação de estoque' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 201, description: 'Movimentação registrada com sucesso' })
  @ApiResponse({ status: 400, description: 'Estoque insuficiente ou dados inválidos' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  registerMovement(
    @Param('id') productId: number,
    @CompanyIdParam() companyId: number,
    @UserIdParam() userId: number,
    @Body() registerMovementDto: RegisterMovementDto,
  ) {
    return this.stockService.registerMovement(
      productId,
      companyId,
      registerMovementDto,
      userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar movimentações de estoque' })
  @ApiResponse({ status: 200, description: 'Lista de movimentações retornada com sucesso' })
  getAllMovements(
    @CompanyIdParam() companyId: number,
    @UserIdParam() userId: number,
    @UserRoleDecorator() userRole: string,
    @Query() filters: GetMovementsFilterDto,
    mine?: string,
  ) {
    const filterByUser = filters.mine === 'true' || userRole === 'USER';

    return this.stockService.getAllMovements(
      filters,
      companyId,
      filterByUser ? userId : undefined,
    );
  }
}
