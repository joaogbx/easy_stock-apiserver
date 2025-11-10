import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: statusCode,
        timestamp: new Date().toISOString(),
        data: data || {},
      })),
      catchError((error) => {
        console.log(error);
        const status =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
          error instanceof HttpException
            ? error.getResponse()
            : 'Erro interno do servidor';

        const errorPayload = {
          success: false,
          statusCode: status,
          timestamp: new Date().toISOString(),
          error: message,
        };

        return throwError(() => new HttpException(errorPayload, status));
      }),
    );
  }
}
