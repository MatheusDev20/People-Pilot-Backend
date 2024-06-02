import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ORG = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.organization;
});
