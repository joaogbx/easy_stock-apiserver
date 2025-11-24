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

@Controller('stock/movements')
@UseGuards(AuthGuard('jwt'))
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post(':id')
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
  getAllMovements(
    @CompanyIdParam() companyId: number,
    @UserIdParam() userId: number,

    @Query('mine') mine?: string,
  ) {
    const filterByUser = mine === 'true';

    return this.stockService.getAllMovements(
      companyId,
      filterByUser ? userId : undefined, // Passa o userId APENAS se o filtro estiver ativado
    );
  }
}
