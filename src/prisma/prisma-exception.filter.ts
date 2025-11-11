import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let error = 'Internal Server Error';

    // Mapeamento de códigos de erro Prisma para HTTP Status
    switch (exception.code) {
      // P2002: Unique constraint failed
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        const field = exception.meta?.target
          ? (exception.meta.target as string[])[0]
          : 'campo';
        message = `Já existe um registro com esse ${field}`;
        error = 'Conflict';
        break;
      }

      // P2025: Record not found
      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = 'Registro não encontrado';
        error = 'Not Found';
        break;
      }

      // P2003: Foreign key constraint failed
      case 'P2003': {
        status = HttpStatus.BAD_REQUEST;
        const field = exception.meta?.field_name || 'foreign key';
        message = `Violação de chave estrangeira em ${field}`;
        error = 'Bad Request';
        break;
      }

      // P2014: Required relation violation
      case 'P2014': {
        status = HttpStatus.BAD_REQUEST;
        message =
          'Não é possível deletar este registro porque está vinculado a outros registros';
        error = 'Bad Request';
        break;
      }

      // P2000: The provided value for the column is too long
      case 'P2000': {
        status = HttpStatus.BAD_REQUEST;
        const field = exception.meta?.column_name || 'campo';
        message = `O valor fornecido para ${field} é muito longo`;
        error = 'Bad Request';
        break;
      }

      // P2015: Related record not found
      case 'P2015': {
        status = HttpStatus.NOT_FOUND;
        message = 'Registro relacionado não encontrado';
        error = 'Not Found';
        break;
      }

      default: {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Erro ao processar requisição no banco de dados';
        error = 'Database Error';
      }
    }

    // Log do erro (sem expor detalhes ao cliente)
    this.logger.error(
      `Database Error [${exception.code}]: ${exception.message}`,
      exception.stack,
    );

    // Resposta ao cliente
    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
