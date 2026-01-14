import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create_company.dto';
import { Company, User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createCompany(
    createCompanyDto: CreateCompanyDto,
    userId: number,
  ): Promise<{ company: Company; user: User }> {
    const hasCompany = await this.prisma.company.findFirst({
      where: { name: createCompanyDto.name },
    });

    //if (hasCompany) {
    //  throw new ConflictException('Já existe uma empresa com esse nome!');
    //}

    try {
      return await this.prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
          data: {
            ...createCompanyDto,
            owner_id: userId,
          },
        });

        const user = await tx.user.update({
          where: { id: userId },
          data: { company_id: company.id },
          include: {
            company: true,
          },
        });

        return {
          company,
          user,
        };
      });
    } catch (error) {
      this.logger.error(error);

      //if (error.code === 'P2002') {
      //  throw new ConflictException('Nome da empresa já está em uso.');
      //}

      throw new InternalServerErrorException('Erro ao criar empresa.');
    }
  }
}
