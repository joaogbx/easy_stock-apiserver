import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_TOKEN_PAYLOAD } from 'src/constants';

export const CompanyIdParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    console.log(request[REQUEST_TOKEN_PAYLOAD]);

    return request.user.company_id;
  },
);
