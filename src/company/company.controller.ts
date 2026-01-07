import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create_company.dto';
import { CompanyService } from './company.service';

import { AuthTokenGuard } from 'src/commons/guards/auth_token.guard';
import { UserIdParam } from 'src/commons/decorators/user_id.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createCompany(
    @Body() createCompany: CreateCompanyDto,
    @UserIdParam() userId,
  ) {
    console.log('user', userId);
    console.log('paylaod', createCompany);
    return this.companyService.createCompany(createCompany, userId);
  }
}
