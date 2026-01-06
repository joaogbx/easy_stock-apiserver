import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashBoardService } from './dashboard.service';
import { CompanyIdParam } from 'src/commons/decorators/company_id.decorator';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashBoardController {
  constructor(private readonly dashBoardService: DashBoardService) {}
  @Get()
  getDashBoard(@CompanyIdParam() companyId: number) {
    return this.dashBoardService.getDashBoard(companyId);
  }
}
