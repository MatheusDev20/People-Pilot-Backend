import { Injectable, Logger } from '@nestjs/common';
import { unauthLoginLog } from 'src/helpers/logs-templates';

@Injectable()
export class CustomLogger extends Logger {
  generateJwtLog(userId: string) {
    this.log(`\n Generating a new JWT for user ${userId} \n Date: ${new Date()} \n Expiration: 1h`);
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
