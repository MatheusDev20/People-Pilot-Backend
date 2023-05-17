import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { getClientIp } from 'src/helpers';
import { unauthLoginLog } from '../../../../helpers/logs-templates';
import { JwtManager } from 'src/modules/security/interfaces/jwt';

@Injectable()
export class LoginGuard implements CanActivate {
  private logger = new Logger();
  constructor(@Inject('JwtManager') private jwtManager: JwtManager) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (this.areCookiesExpired(request.cookies)) {
      this.logger.error(
        unauthLoginLog({
          reason: 'Expired Cookie',
          ipAddress: getClientIp(request),
          time: new Date(),
          userAgent: request.headers['user-agent'],
        }),
      );
      throw new UnauthorizedException('Expired Cookie');
    }
    const token = this.exctractFromCookies(request);

    if (!token) {
      throw new UnauthorizedException('Unauthorized Request');
    }
    try {
      const payload = await this.jwtManager.verifyToken(token);
      request['user'] = payload;
      this.logger.log(`Sucessfull logged user ${payload.id}`);
    } catch (err) {
      this.logger.error(
        unauthLoginLog({
          reason: err.message,
          ipAddress: getClientIp(request),
          time: new Date(),
          userAgent: request.headers['user-agent'],
        }),
      );
      throw new UnauthorizedException('Unauthorized Request');
    }
    return true;
  }

  exctractFromCookies(request: Request): string | undefined {
    if (request.cookies && request.cookies.access_token) {
      return request.cookies.access_token;
    }
    return null;
  }

  areCookiesExpired = (cookies: any) => Object.keys(cookies).length === 0;
}
