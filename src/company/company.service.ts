import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create_company.dto';
import { Company } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompany(
    createCompanyDto: CreateCompanyDto,
    userId,
  ): Promise<Company> {
    console.log(userId);
    const hasCompany = await this.prisma.company.findFirst({
      where: {
        name: createCompanyDto.name,
      },
    });

    if (hasCompany)
      throw new BadRequestException('Já existe uma empresa com esse nome!');
    try {
      const company = await this.prisma.company.create({
        data: {
          ...createCompanyDto,
          owner_id: userId,
        },
      });

      return company;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
