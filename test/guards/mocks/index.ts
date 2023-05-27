/* eslint-disable @typescript-eslint/no-empty-function */
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

type ctxProps = {
  cookies?: object;
  ip?: string;
  headers?: object;
};
export const makeGenericContext = (opts: ctxProps) => {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        cookies: opts.cookies,
        ip: opts.ip,
        headers: opts.headers,
        user: {
          id: 'auth_user_id',
        },
      }),
    }),
    getHandler: function () {},
    getClass: function () {},
  } as ExecutionContextHost;
};
