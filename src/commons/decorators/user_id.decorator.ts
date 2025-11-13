import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_TOKEN_PAYLOAD } from 'src/constants';

export const UserIdParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user?.id;
  },
);
