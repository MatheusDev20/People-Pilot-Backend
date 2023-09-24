import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtManager } from 'src/modules/security/interfaces/jwt';
import { CustomLogger } from 'src/modules/logger/services/logger.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(@Inject('JwtManager') private jwtManager: JwtManager, private logger: CustomLogger) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    console.log('Cookies from the Browser', request.cookies);
    if (this.areCookiesExpired(request.cookies)) {
      this.logger.expiredCookie(request.ip, request['headers']['user-agent']);
      throw new UnauthorizedException('Expired Cookie');
    }

    const token = this.exctractFromCookies(request);

    if (!token) {
      throw new UnauthorizedException('Unauthorized Request');
    }

    try {
      const payload = await this.jwtManager.verifyToken(token);
      request['user'] = payload;
      this.logger.sucessFullLogin(payload.id);
    } catch (err) {
      this.logger.failedAttempt(err.message, request.ip, request['headers']['user-agent']);
      throw new UnauthorizedException('Unauthorized Request');
    }

    return true;
  }

  exctractFromCookies(request: Request): string | null {
    if (request.cookies && request.cookies.access_token) {
      return request.cookies.access_token;
    }
    return null;
  }

  areCookiesExpired = (cookies: any) => {
    return Object.keys(cookies).length === 0;
  };
}
