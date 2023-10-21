import { Injectable, Logger } from '@nestjs/common';
import { unauthLoginLog } from '../../../helpers/logs-templates/unathorized-login';
import { LoggerFunctions } from 'src/@types';

@Injectable()
export class CustomLogger extends Logger implements LoggerFunctions {
  generateJwtLog(username: string, expiresIn: string) {
    this.log(
      `\n Generating a new JWT for user ${username} \n Date: ${new Date()} \n Expiration: ${expiresIn} miliseconds`,
    );
  }

  expiredCookie(ipAddress: any, userAgent: string) {
    this.error(
      unauthLoginLog({
        reason: 'Expired Cookie',
        ipAddress,
        time: new Date(),
        userAgent,
      }),
    );
  }

  sucessFullLogin(id: string) {
    this.log(`Sucessfull logged user ${id}`);
  }

  failedAttempt(errMsg: any, ipAddress: any, userAgent: string) {
    this.error(
      unauthLoginLog({
        reason: errMsg,
        ipAddress,
        time: new Date(),
        userAgent,
      }),
    );
  }
}
