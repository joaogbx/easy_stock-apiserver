import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashBoardService } from './dashboard.service';
import { CompanyIdParam } from 'src/commons/decorators/company_id.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class DashBoardController {
  constructor(private readonly dashBoardService: DashBoardService) {}
  
  @Get()
  @ApiOperation({ summary: 'Obter métricas e estatísticas da empresa' })
  @ApiResponse({ status: 200, description: 'Métricas retornadas com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  getDashBoard(@CompanyIdParam() companyId: number) {
    return this.dashBoardService.getDashBoard(companyId);
  }
}
