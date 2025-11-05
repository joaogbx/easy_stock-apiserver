import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create_company.dto';
import { CompanyService } from './company.service';

import { AuthTokenGuard } from 'src/commons/guards/auth_token.guard';
import { UserIdParam } from 'src/commons/decorators/user_id.decorator';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(AuthTokenGuard)
  async createCompany(
    @Body() createCompany: CreateCompanyDto,
    @UserIdParam() userId,
  ) {
    return this.companyService.createCompany(createCompany, userId);
  }
}
