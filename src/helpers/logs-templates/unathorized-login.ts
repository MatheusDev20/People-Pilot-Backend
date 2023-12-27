import { UnauthLoginLog } from './DTOs/logs';

export const unauthLoginLog = (data: UnauthLoginLog) =>
  `[${data.time}] Failed login atempt \n
          IP Address: ${data.ipAddress} \n
          User Agent: ${data.userAgent} \n
          Both RefreshToken and AccessToken Expired \n
          Reason: ${data.reason}`;
