import { UnauthLoginLog } from './DTOs/logs';

export const unauthLoginLog = (data: UnauthLoginLog) => {
  return `[${data.time}] Failed login atempt \n
          IP Address: ${data.ipAddress} \n
          User Agent: ${data.userAgent} \n
          Reason: ${data.reason}`;
};
