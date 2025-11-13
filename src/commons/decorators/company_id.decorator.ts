import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CompanyIdParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user?.company_id;
  },
);
